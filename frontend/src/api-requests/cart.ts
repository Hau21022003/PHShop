import http from "@/lib/http";
import { CartItemBodyType } from "@/schemas/cart.schema";

const CART_BASE = "/cart";
export const cartApiRequest = {
  createCartItem: (body: CartItemBodyType) =>
    http.post<CartItemBodyType>(`${CART_BASE}/`, body),
};
