"use client";
import { chatApiRequest } from "@/api-requests/chat";
import { handleErrorApi } from "@/lib/error";
import { socketService } from "@/lib/socket";
import { cartService } from "@/lib/user/cart/cart-service";
import { CartItemResType } from "@/schemas/cart.schema";
import { useAppStore } from "@/stores/app-store";
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
  countUnreadMessages: number;
  fetchCountUnreadMessages: () => void;
};

export const UserContext = createContext<UserContextType>({
  scrollRef: { current: null },
  cart: [],
  loadCart: () => {},
  countUnreadMessages: 0,
  fetchCountUnreadMessages: () => {},
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAppStore();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [cart, setCartState] = useState<CartItemResType[]>([]);
  const [countUnreadMessages, setCountUnreadMessages] = useState(0);
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

  const fetchCountUnreadMessages = async () => {
    try {
      const count = (await chatApiRequest.countAdminUnreadMessages()).payload
        .count;
      setCountUnreadMessages(count);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCountUnreadMessages();
      const socket = socketService.connect();

      socket.on("receive_message", () => {
        fetchCountUnreadMessages();
      });

      return () => {
        socketService.disconnect();
      };
    }
    // Ham dọn dẹp
  }, [isAuthenticated]);

  return (
    <UserContext.Provider
      value={{
        scrollRef,
        cart,
        loadCart,
        countUnreadMessages,
        fetchCountUnreadMessages,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
