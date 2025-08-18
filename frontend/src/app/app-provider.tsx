"use client";
import { AccountResType } from "@/schemas/account.schema";
import { authStorage } from "@/lib/auth/auth-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = AccountResType;

const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  isLoading: true,
});
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<User | null>(() => {
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = Boolean(user);
  const setUser = useCallback(
    (user: User | null) => {
      setUserState(user);
      if (user) authStorage.saveUser(user);
      else authStorage.clear();
    },
    [setUserState]
  );

  useEffect(() => {
    try {
      const _user = authStorage.getUser();
      setUserState(_user || null);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUserState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
