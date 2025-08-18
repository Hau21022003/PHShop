import {
  CartItemBodyType,
  CartItemResType,
  UpdateCartItemType,
} from "@/schemas/cart.schema";
import { authStorage } from "@/lib/auth/auth-storage";
import { cartApiRequest } from "@/api-requests/cart";
import { cartStorage } from "@/lib/user/cart-storage";
import { productApiRequest } from "@/api-requests/product";
import { handleErrorApi } from "@/lib/error";

export const cartService = {
  addCartItem: async (cartItem: CartItemBodyType) => {
    if (Boolean(authStorage.getUser())) {
      await cartApiRequest.createCartItem(cartItem);
    } else {
      cartStorage.addItem(cartItem);
    }
  },
  getCart: async () => {
    if (Boolean(authStorage.getUser())) {
      try {
        const rsp = await cartApiRequest.findAll();
        return rsp.payload;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    } else {
      const cartLocal = cartStorage.getCart();
      const cart = await Promise.all(
        cartLocal.map(async (cartItem) => {
          const productRsp = await productApiRequest.findOne(cartItem.product);
          const product = productRsp.payload;
          return { ...cartItem, product } as CartItemResType;
        })
      );
      return cart;
    }
  },
  // updateCartItemQuantity: async (id: string, newQuantity: number) => {
  //   if (Boolean(authStorage.getUser())) {
  //     await cartApiRequest.updateCartItem(id, { quantity: newQuantity });
  //   } else {
  //     cartStorage.updateItem(id, { quantity: newQuantity });
  //   }
  // },
  updateCartItem: async (id: string, updates: UpdateCartItemType) => {
    if (Boolean(authStorage.getUser())) {
      const rsp = await cartApiRequest.updateCartItem(id, updates);
      return rsp.payload;
    } else {
      cartStorage.updateItem(id, updates);
      const cartItem = cartStorage.findOne(id);
      const productRsp = await productApiRequest.findOne(
        cartItem?.product || ""
      );
      const product = productRsp.payload;
      return { ...cartItem, product } as CartItemResType;
    }
  },
  removeCartItem: async (id: string) => {
    if (Boolean(authStorage.getUser())) {
      await cartApiRequest.removeCartItem(id);
    } else {
      cartStorage.removeItem(id);
    }
  },
};
