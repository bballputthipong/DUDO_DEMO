import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { useWalletQuery } from "@/src/api/hooks";
import { AppText } from "@/src/components/AppText";
import { AsyncStateView } from "@/src/components/AsyncStateView";
import { Screen } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { WalletSummary } from "@/src/components/WalletSummary";
import { useAuthStore } from "@/src/stores/auth-store";
import { useWalletStore } from "@/src/stores/wallet-store";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";

export default function WalletScreen() {
  const userId = useAuthStore((state) => state.user?.id ?? "user-demo");
  const setWallet = useWalletStore((state) => state.setWallet);
  const walletQuery = useWalletQuery(userId);
  const snapshot = walletQuery.data;
  const transactions = snapshot?.transactions ?? [];

  useEffect(() => {
    if (snapshot) {
      setWallet(snapshot.balance, snapshot.transactions);
    }
  }, [setWallet, snapshot]);

  const state = (
    <AsyncStateView
      empty={transactions.length === 0}
      emptyDescription="whenHasการเติมOrUse token itemsจะแสดงAtนี่"
      emptyTitle="YetNotHas transaction"
      error={walletQuery.error}
      loading={walletQuery.isLoading}
      onRetry={() => {
        void walletQuery.refetch();
      }}
    />
  );

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Wallet</AppText>
        <AppText muted>Manage token From personal, corporate And bonus</AppText>
      </View>

      {walletQuery.isSuccess && snapshot ? (
        <View style={styles.sections}>
          <WalletSummary balance={snapshot.balance} />

          <View>
            <SectionHeader title="Transaction history" />
            {transactions.length > 0 ? (
              <View style={styles.list}>
                {transactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transaction}>
                    <View>
                      <AppText variant="title">{transaction.label}</AppText>
                      <AppText muted style={styles.transactionMeta}>
                        {transaction.source}
                      </AppText>
                    </View>
                    <AppText style={[styles.amount, transaction.amount > 0 ? styles.amountPositive : styles.amountNegative]}>
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount}
                    </AppText>
                  </View>
                ))}
              </View>
            ) : (
              state
            )}
          </View>
        </View>
      ) : (
        state
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing[2],
    marginBottom: spacing[6],
  },
  sections: {
    gap: spacing[8],
  },
  list: {
    gap: spacing[3],
  },
  transaction: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing[4],
    ...shadow.sm,
  },
  transactionMeta: {
    textTransform: "capitalize",
  },
  amount: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
  },
  amountPositive: {
    color: colors.navy[700],
  },
  amountNegative: {
    color: colors.accent[700],
  },
});
