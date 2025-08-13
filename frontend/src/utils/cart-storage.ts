import { storage } from "@/utils/storage";

const CART_KEY = "cart";

export const cartStorage = {
  getCart() {
    return storage.get(CART_KEY) || [];
  },

  saveCart(cart) {
    storage.set(CART_KEY, cart);
  },

  addItem(item) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex((p) => p.id === item.id);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity || 1;
    } else {
      cart.push({ ...item, quantity: item.quantity || 1 });
    }

    this.saveCart(cart);
  },

  removeItem(id) {
    const cart = this.getCart().filter((item) => item.id !== id);
    this.saveCart(cart);
  },

  clearCart() {
    storage.remove(CART_KEY);
  },

  getTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },
};
