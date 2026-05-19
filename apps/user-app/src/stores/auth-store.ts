import { create } from "zustand";

import type { AuthSession, AuthTokens, UserProfile } from "@/src/types/domain";

interface AuthState {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  setSession: (session) => {
    set({ user: session.user, tokens: session.tokens });
  },
  clearSession: () => {
    set({ user: null, tokens: null });
  },
}));
