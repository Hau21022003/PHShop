"use client";
import { useCartContext } from "@/app/(user)/cart/cart-provider";
import CartSummary from "@/app/(user)/cart/components/cart-summary";
import MainCart from "@/app/(user)/cart/components/main-cart";
import { closeLoading, showLoading } from "@/components/loading-overlay";
import { handleErrorApi } from "@/lib/error";
import { cartService } from "@/lib/user/cart/cart-service";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";

export default function CartPage() {
  const [loading, setLoading] = useState(true);
  const { cartItems, setCartItems } = useCartContext();
  const load = async () => {
    try {
      setLoading(true);
      showLoading();
      const cartItems = await cartService.getCart();
      setCartItems(cartItems || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
      closeLoading();
    }
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <div
      className={`container max-w-[1200px] mx-auto px-6 py-6 ${
        cartItems.length === 0
          ? "h-full flex flex-col gap-10 items-center justify-center"
          : ""
      }`}
    >
      {!loading && cartItems.length === 0 && (
        <Fragment>
          <p className="text-lg">You have no cart products.</p>
          <Link href={"/product-list"} className="w-full md:w-96">
            <p
              className="cursor-pointer uppercase text-lg font-bold tracking-wide
        bg-black text-white w-full py-4 text-center"
            >
              Continue Shopping
            </p>
          </Link>
        </Fragment>
      )}
      {cartItems.length !== 0 && (
        <div className="flex items-start flex-col gap-8 lg:flex-row lg:gap-20">
          <div className="w-full lg:flex-1">
            <MainCart />
          </div>
          <div className="w-full lg:w-80 sticky bottom-0 lg:top-4 lg:bottom-auto">
            <div className="sticky top-4">
              <CartSummary />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
