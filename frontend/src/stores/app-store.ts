import { authStorage } from "@/lib/auth/auth-storage";
import { AccountType } from "@/schemas/account.schema";
import { create } from "zustand";

type AppStore = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  user: AccountType | null;
  setUser: (user: AccountType | null) => void;
  isAuthenticated: () => boolean;
};

export const useAppStore = create<AppStore>()((set, get) => ({
  isLoading: true,
  user: null,
  setUser: (user: AccountType | null) => {
    set({ user: user });
    if (user) authStorage.saveUser(user);
  },
  isAuthenticated: () => get().user !== null,
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading: isLoading });
  },
}));
