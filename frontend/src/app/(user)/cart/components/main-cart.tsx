"use client";
import { useCartContext } from "@/app/(user)/cart/cart-provider";
import CartItem from "@/app/(user)/cart/components/cart-item";
import { cartService } from "@/lib/user/cart-service";
import React, { Fragment, useEffect } from "react";

export default function MainCart() {
  const { cartItems, setCartItems } = useCartContext();
  const load = async () => {
    const cartItems = await cartService.getCart();
    setCartItems(cartItems || []);
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <div className="space-y-6">
        {cartItems.map((cartItem, index) => (
          <Fragment key={cartItem._id}>
            <CartItem item={cartItem} />
            {index !== cartItems.length - 1 && (
              <div className="border-t-2 border-black"></div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
