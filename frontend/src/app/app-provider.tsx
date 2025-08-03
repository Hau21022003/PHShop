"use client";
import { AccountResType } from "@/schemas/account.schema";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = AccountResType["data"];

const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean; // Thêm loading state
}>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  isLoading: true, // Default là loading
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
    // if (isClient()) {
    //   const _user = localStorage.getItem('user')
    //   return _user ? JSON.parse(_user) : null
    // }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = Boolean(user);
  const setUser = useCallback(
    (user: User | null) => {
      setUserState(user);
      localStorage.setItem("user", JSON.stringify(user));
    },
    [setUserState]
  );

  // useEffect(() => {
  //   const _user = localStorage.getItem("user");
  //   setUserState(_user ? JSON.parse(_user) : null);
  // }, [setUserState]);
  useEffect(() => {
    try {
      const _user = localStorage.getItem("user");
      setUserState(_user ? JSON.parse(_user) : null);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUserState(null);
    } finally {
      setIsLoading(false); // Kết thúc loading
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
