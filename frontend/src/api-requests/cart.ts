import http from "@/lib/http";
import {
  CartItemBodyType,
  CartItemResType,
  UpdateCartItemType,
} from "@/schemas/cart.schema";

const CART_BASE = "/cart";
export const cartApiRequest = {
  createCartItem: (body: CartItemBodyType) =>
    http.post<CartItemBodyType>(`${CART_BASE}/`, body),
  findAll: () => http.get<CartItemResType[]>(`${CART_BASE}/`),
  createBatch: (body: CartItemBodyType[]) =>
    http.post<CartItemBodyType>(`${CART_BASE}/batch`, body),
  updateCartItem: (id: string, body: UpdateCartItemType) =>
    http.put<CartItemResType>(`${CART_BASE}/${id}`, body),
  removeCartItem: (id: string) =>
    http.delete<CartItemResType>(`${CART_BASE}/${id}`),
  findCartItem: (id: string) =>
    http.get<CartItemResType>(`${CART_BASE}/${id}`),
};
