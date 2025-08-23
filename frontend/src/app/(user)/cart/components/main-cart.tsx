"use client";
import { useCartContext } from "@/app/(user)/cart/cart-provider";
import CartItem from "@/app/(user)/cart/components/cart-item";
import React, { Fragment } from "react";

export default function MainCart() {
  const { cartItems } = useCartContext();

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
        {cartItems.length === 0 && (
          <div className="flex justify-center">
            <p className="text-xl font-medium">Your cart is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}
