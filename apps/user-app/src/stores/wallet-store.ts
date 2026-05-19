import { create } from "zustand";

import type { WalletBalance, WalletTransaction } from "@/src/types/domain";

interface WalletState {
  balance: WalletBalance | null;
  transactions: WalletTransaction[];
  setWallet: (balance: WalletBalance, transactions: WalletTransaction[]) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: null,
  transactions: [],
  setWallet: (balance, transactions) => {
    set({ balance, transactions });
  },
}));
