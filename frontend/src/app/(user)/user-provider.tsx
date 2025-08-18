"use client";
import { handleErrorApi } from "@/lib/error";
import { cartService } from "@/lib/user/cart-service";
import { cartStorage } from "@/lib/user/cart-storage";
import { CartItemRes, CartItemResType } from "@/schemas/cart.schema";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type UserContextType = {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  cart: CartItemResType[];
  loadCart: () => void;
};

export const UserContext = createContext<UserContextType>({
  scrollRef: { current: null },
  cart: [],
  loadCart: () => {},
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [cart, setCartState] = useState<CartItemResType[]>([]);
  const setCart = useCallback(
    (cart: CartItemResType[]) => {
      setCartState(cart);
    },
    [setCartState]
  );
  const loadCart = async () => {
    try {
      const cart = (await cartService.getCart()) || [];
      setCart(cart);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <UserContext.Provider value={{ scrollRef, cart, loadCart }}>
      {children}
    </UserContext.Provider>
  );
};
