import CartProvider from "@/app/(user)/cart/cart-provider";
import CartSummary from "@/app/(user)/cart/components/cart-summary";
import MainCart from "@/app/(user)/cart/components/main-cart";
import React from "react";

export default function CartPage() {
  return (
    <div className="container max-w-[1200px] mx-auto px-6 py-6">
      <div className="flex items-start flex-col gap-8 lg:flex-row lg:gap-20">
        <CartProvider>
          <div className="w-full lg:flex-1">
            <MainCart />
          </div>
          <div className="w-full lg:w-80 sticky bottom-0 lg:top-4 lg:bottom-auto">
            <div className="sticky top-4">
              <CartSummary />
            </div>
          </div>
        </CartProvider>
      </div>
    </div>
  );
}
