import { CartItemBodyType } from "@/schemas/cart.schema";
import { storage } from "@/utils/storage";

const CART_KEY = "cart";

export type CartItemLocalType = CartItemBodyType & {
  _id: string;
  createdDate: string;
  updatedDate: string;
};

export const cartStorage = {
  getCart() {
    return (storage.get(CART_KEY) as CartItemLocalType[]) || [];
  },

  saveCart(cart: CartItemLocalType[]) {
    storage.set(CART_KEY, cart);
  },

  addItem(item: CartItemBodyType) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      (p) =>
        p.product === item.product &&
        p.attributeVariant?.every((attributeVariant) =>
          item.attributeVariant?.some(
            (otherAttributeVariant) =>
              attributeVariant.option === otherAttributeVariant.option &&
              attributeVariant.title === otherAttributeVariant.title
          )
        )
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity = item.quantity || 1;
    } else {
      cart.unshift({
        ...item,
        _id: crypto.randomUUID(),
        quantity: item.quantity || 1,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      });
    }

    this.saveCart(cart);
  },

  updateItem(id: string, updates: Partial<CartItemLocalType>) {
    const cart = this.getCart();
    const index = cart.findIndex((item) => item._id === id);

    if (index >= 0) {
      cart[index] = {
        ...cart[index],
        ...updates,
        updatedDate: new Date().toISOString(),
      };

      this.saveCart(cart);
    }
  },

  removeItem(id: string) {
    const cart = this.getCart().filter((item) => item._id !== id);
    this.saveCart(cart);
  },

  findOne(id: string) {
    const cartItem = this.getCart().findLast((item) => item._id === id);
    return cartItem;
  },

  clearCart() {
    storage.remove(CART_KEY);
  },
};
