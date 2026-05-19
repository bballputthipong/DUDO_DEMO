import { Injectable } from '@nestjs/common';
import {
  TokenSource,
  Wallet,
  WalletTransaction,
  WalletTxType,
} from '@prisma/client';

import { InsufficientTokenError } from '../../shared/errors/app-error';
import { PrismaService } from '../../shared/prisma/prisma.service';
import type { PrismaTx } from '../../shared/types/prisma';
import type { PaginationInput } from './wallet.schemas';
import type { WalletBalance } from './wallet.types';

type WalletSourceField =
  | 'personalTokenBalance'
  | 'corporateTokenBalance'
  | 'bonusTokenBalance';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(userId: string): Promise<WalletBalance> {
    const wallet = await this.getOrCreateWallet(userId);
    return this.toBalance(wallet);
  }

  async getTransactionHistory(
    userId: string,
    pagination: PaginationInput,
  ): Promise<{ data: WalletTransaction[]; meta: Record<string, number> }> {
    const [transactions, total] = await this.prisma.$transaction([
      this.prisma.walletTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (pagination.page - 1) * pagination.perPage,
        take: pagination.perPage,
      }),
      this.prisma.walletTransaction.count({ where: { userId } }),
    ]);

    return {
      data: transactions,
      meta: {
        page: pagination.page,
        perPage: pagination.perPage,
        total,
        totalPages: Math.ceil(total / pagination.perPage),
      },
    };
  }

  async creditPersonal(
    userId: string,
    amount: number,
    description: string,
    tx?: PrismaTx,
  ): Promise<WalletTransaction> {
    return this.credit(userId, TokenSource.PERSONAL, amount, description, undefined, undefined, tx);
  }

  async creditCorporate(
    userId: string,
    companyId: string,
    amount: number,
    tx?: PrismaTx,
  ): Promise<WalletTransaction> {
    return this.credit(
      userId,
      TokenSource.CORPORATE,
      amount,
      `Corporate allocation ${companyId}`,
      companyId,
      undefined,
      tx,
    );
  }

  async creditBonus(
    userId: string,
    amount: number,
    expiresAt: Date,
    description: string,
    tx?: PrismaTx,
  ): Promise<WalletTransaction> {
    return this.credit(userId, TokenSource.BONUS, amount, description, undefined, expiresAt, tx);
  }

  async deductForBooking(
    userId: string,
    bookingId: string,
    amount: number,
    preferredSource: TokenSource,
    tx?: PrismaTx,
  ): Promise<WalletTransaction> {
    const runner = async (client: PrismaTx): Promise<WalletTransaction> => {
      const wallet = await this.getOrCreateWallet(userId, client);
      if (this.availableBalance(wallet, preferredSource) < amount) {
        throw new InsufficientTokenError();
      }

      let remaining = amount;
      let lastTransaction: WalletTransaction | null = null;
      const sources = this.deductionPriority(preferredSource);

      for (const source of sources) {
        if (remaining <= 0) {
          break;
        }

        const field = this.sourceField(source);
        const balanceBefore = wallet[field];
        const debit = Math.min(balanceBefore, remaining);
        if (debit <= 0) {
          continue;
        }

        const updated = await client.wallet.update({
          where: { userId },
          data: { [field]: { decrement: debit } },
        });

        wallet[field] = updated[field];
        remaining -= debit;
        lastTransaction = await client.walletTransaction.create({
          data: {
            walletId: wallet.id,
            userId,
            bookingId,
            type: WalletTxType.DEBIT_BOOKING,
            source,
            amount: -debit,
            balanceBefore,
            balanceAfter: updated[field],
            description: `Booking ${bookingId}`,
          },
        });
      }

      if (remaining > 0 || lastTransaction === null) {
        throw new InsufficientTokenError();
      }

      return lastTransaction;
    };

    return tx ? runner(tx) : this.prisma.$transaction(runner);
  }

  async refundBooking(bookingId: string, tx?: PrismaTx): Promise<WalletTransaction> {
    const runner = async (client: PrismaTx): Promise<WalletTransaction> => {
      const debits = await client.walletTransaction.findMany({
        where: { bookingId, type: WalletTxType.DEBIT_BOOKING },
        orderBy: { createdAt: 'asc' },
      });

      let lastTransaction: WalletTransaction | null = null;
      for (const debit of debits) {
        const amount = Math.abs(debit.amount);
        const wallet = await client.wallet.findUniqueOrThrow({ where: { id: debit.walletId } });
        const field = this.sourceField(debit.source);
        const updated = await client.wallet.update({
          where: { id: wallet.id },
          data: { [field]: { increment: amount } },
        });
        lastTransaction = await client.walletTransaction.create({
          data: {
            walletId: wallet.id,
            userId: debit.userId,
            bookingId,
            companyId: debit.companyId,
            type: WalletTxType.CREDIT_REFUND,
            source: debit.source,
            amount,
            balanceBefore: wallet[field],
            balanceAfter: updated[field],
            description: `Refund booking ${bookingId}`,
          },
        });
      }

      if (lastTransaction === null) {
        throw new InsufficientTokenError();
      }

      return lastTransaction;
    };

    return tx ? runner(tx) : this.prisma.$transaction(runner);
  }

  async adminAdjust(
    userId: string,
    amount: number,
    source: TokenSource,
    reason: string,
    _adminId: string,
    tx?: PrismaTx,
  ): Promise<WalletTransaction> {
    const wallet = await this.getOrCreateWallet(userId, tx);
    if (amount < 0 && wallet[this.sourceField(source)] < Math.abs(amount)) {
      throw new InsufficientTokenError();
    }

    return this.recordBalanceChange(
      userId,
      source,
      amount,
      WalletTxType.CREDIT_ADMIN_ADJUSTMENT,
      WalletTxType.DEBIT_ADMIN_ADJUSTMENT,
      reason,
      undefined,
      undefined,
      undefined,
      tx,
    );
  }

  async getOrCreateWallet(userId: string, tx?: PrismaTx): Promise<Wallet> {
    const client = tx ?? this.prisma;
    const wallet = await client.wallet.findUnique({ where: { userId } });
    if (wallet !== null) {
      return wallet;
    }

    return client.wallet.create({ data: { userId } });
  }

  private async credit(
    userId: string,
    source: TokenSource,
    amount: number,
    description: string,
    companyId?: string,
    expiresAt?: Date,
    tx?: PrismaTx,
  ): Promise<WalletTransaction> {
    return this.recordBalanceChange(
      userId,
      source,
      amount,
      WalletTxType.CREDIT_PURCHASE,
      WalletTxType.DEBIT_ADMIN_ADJUSTMENT,
      description,
      companyId,
      expiresAt,
      undefined,
      tx,
    );
  }

  private async recordBalanceChange(
    userId: string,
    source: TokenSource,
    amount: number,
    creditType: WalletTxType,
    debitType: WalletTxType,
    description: string,
    companyId?: string,
    expiresAt?: Date,
    bookingId?: string,
    tx?: PrismaTx,
  ): Promise<WalletTransaction> {
    const runner = async (client: PrismaTx): Promise<WalletTransaction> => {
      const wallet = await this.getOrCreateWallet(userId, client);
      const field = this.sourceField(source);
      const balanceBefore = wallet[field];
      const updated = await client.wallet.update({
        where: { userId },
        data: {
          [field]: amount >= 0 ? { increment: amount } : { decrement: Math.abs(amount) },
        },
      });

      return client.walletTransaction.create({
        data: {
          walletId: wallet.id,
          userId,
          bookingId,
          companyId,
          type: amount >= 0 ? creditType : debitType,
          source,
          amount,
          balanceBefore,
          balanceAfter: updated[field],
          description,
          expiresAt,
        },
      });
    };

    return tx ? runner(tx) : this.prisma.$transaction(runner);
  }

  private availableBalance(wallet: Wallet, preferredSource: TokenSource): number {
    return this.deductionPriority(preferredSource).reduce((sum, source) => {
      return sum + wallet[this.sourceField(source)];
    }, 0);
  }

  private deductionPriority(preferredSource: TokenSource): TokenSource[] {
    if (preferredSource === TokenSource.CORPORATE) {
      return [TokenSource.BONUS, TokenSource.CORPORATE, TokenSource.PERSONAL];
    }

    return [TokenSource.BONUS, TokenSource.PERSONAL];
  }

  private sourceField(source: TokenSource): WalletSourceField {
    const fields: Record<TokenSource, WalletSourceField> = {
      [TokenSource.PERSONAL]: 'personalTokenBalance',
      [TokenSource.CORPORATE]: 'corporateTokenBalance',
      [TokenSource.BONUS]: 'bonusTokenBalance',
    };
    return fields[source];
  }

  private toBalance(wallet: Wallet): WalletBalance {
    return {
      personal: wallet.personalTokenBalance,
      corporate: wallet.corporateTokenBalance,
      bonus: wallet.bonusTokenBalance,
      total:
        wallet.personalTokenBalance + wallet.corporateTokenBalance + wallet.bonusTokenBalance,
    };
  }
}
