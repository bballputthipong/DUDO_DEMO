import { create } from 'zustand';

interface PartnerInfo {
  id: string;
  businessName: string;
  businessType: string;
  logoUrl: string | null;
  status: string;
}

interface AuthState {
  token: string | null;
  partner: PartnerInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (token: string, partner: PartnerInfo) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  partner: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (token: string, partner: PartnerInfo) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('partner_auth_token', token);
      localStorage.setItem('partner_info', JSON.stringify(partner));
    }
    set({ token, partner, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('partner_auth_token');
      localStorage.removeItem('partner_info');
    }
    set({ token: null, partner: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  hydrate: () => {
    if (typeof window === 'undefined') {
      set({ isLoading: false });
      return;
    }
    const token = localStorage.getItem('partner_auth_token');
    const partnerRaw = localStorage.getItem('partner_info');

    if (token && partnerRaw) {
      try {
        const partner = JSON.parse(partnerRaw) as PartnerInfo;
        set({ token, partner, isAuthenticated: true, isLoading: false });
      } catch {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
