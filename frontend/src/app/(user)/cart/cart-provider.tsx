"use client";
import { CartItemResType } from "@/schemas/cart.schema";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext<{
  cartItems: CartItemResType[];
  setCartItems: Dispatch<SetStateAction<CartItemResType[]>>;
  selectedCartIds: string[];
  setSelectedCartIds: Dispatch<SetStateAction<string[]>>;
  totalCheckout: number;
  setTotalCheckout: Dispatch<SetStateAction<number>>;
}>({
  cartItems: [],
  setCartItems: () => {},
  selectedCartIds: [],
  setSelectedCartIds: () => {},
  totalCheckout: 0,
  setTotalCheckout: () => {},
});
export const useCartContext = () => {
  const context = useContext(CartContext);
  return context;
};
export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartItems, setCartItems] = useState<CartItemResType[]>([]);
  const [selectedCartIds, setSelectedCartIds] = useState<string[]>([]);
  const [totalCheckout, setTotalCheckout] = useState(0);

  const updateCheckoutTotal = () => {
    const totalPrice = selectedCartIds.reduce((sum, cartItemId) => {
      const cartItem = cartItems.findLast((item) => item._id === cartItemId);
      if (!cartItem) return sum;
      const price = cartItem.quantity * cartItem.snapshot.price;
      return sum + price;
    }, 0);
    setTotalCheckout(totalPrice);
  };

  useEffect(() => {
    updateCheckoutTotal();
  }, [selectedCartIds]);

  useEffect(() => {
    const cartItemIds = cartItems.map((item) => item._id);
    setSelectedCartIds((prev) => prev.filter((id) => cartItemIds.includes(id)));
    updateCheckoutTotal();
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        selectedCartIds,
        setSelectedCartIds,
        totalCheckout,
        setTotalCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
