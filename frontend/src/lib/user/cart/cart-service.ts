import {
  CartItemBodyType,
  CartItemResType,
  UpdateCartItemType,
} from "@/schemas/cart.schema";
import { authStorage } from "@/lib/auth/auth-storage";
import { cartApiRequest } from "@/api-requests/cart";
import { cartStorage } from "@/lib/user/cart/cart-storage";
import { productApiRequest } from "@/api-requests/product";
import { handleErrorApi } from "@/lib/error";

const isSameAttributes = (
  a: { title: string; option: string }[],
  b: { title: string; option: string }[]
) => {
  if (a.length !== b.length) return false;
  return a.every((attr) =>
    b.some((x) => x.title === attr.title && x.option === attr.option)
  );
};

export const cartService = {
  addCartItem: async (cartItem: CartItemBodyType) => {
    if (Boolean(authStorage.getUser())) {
      await cartApiRequest.createCartItem(cartItem);
    } else {
      const product = (await productApiRequest.findOne(cartItem.product))
        .payload;
      cartItem.snapshot.discount = product.discount;

      const cartItems = cartStorage.getCart();
      const existingCartItem = cartItems.find((item) => {
        if (item.product !== cartItem.product) return false;
        return isSameAttributes(
          item.attributeVariant ?? [],
          cartItem.attributeVariant ?? []
        );
      });
      if (existingCartItem) {
        return cartService.updateCartItem(existingCartItem._id, {
          ...cartItem,
          quantity: existingCartItem.quantity + cartItem.quantity,
        });
      } else {
        cartStorage.addItem(cartItem);
      }
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
  findOne: async (id: string) => {
    if (Boolean(authStorage.getUser())) {
      const cartItem = (await cartApiRequest.findCartItem(id)).payload;
      return cartItem;
    } else {
      const cartItem = cartStorage.findOne(id);
      if (!cartItem) throw new Error("Cart item not found");
      const product = (await productApiRequest.findOne(cartItem.product))
        .payload;
      return { ...cartItem, product } as CartItemResType;
    }
  },
};
