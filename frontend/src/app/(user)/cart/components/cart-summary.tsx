"use client";
import { useCartContext } from "@/app/(user)/cart/cart-provider";
import Link from "next/link";
import React from "react";

export default function CartSummary() {
  const { totalCheckout, selectedCartIds } = useCartContext();
  return (
    <div className="p-3 border-2 bg-white border-black space-y-3">
      <p className="text-lg font-medium uppercase">Order summary</p>
      <div className="flex items-center justify-between">
        <p className="uppercase text-gray-600">Total</p>
        <p className="font-medium">{totalCheckout.toLocaleString("vi-VN")}đ</p>
      </div>
      {selectedCartIds.length === 0 ? (
        <div className="cursor-not-allowed w-full p-3 bg-black text-white uppercase text-center">
          Checkout
        </div>
      ) : (
        <Link href={`/checkout?cartItemIds=${selectedCartIds.join(",")}`}>
          <p className="w-full p-3 bg-black text-white uppercase text-center cursor-pointer">
            Checkout
          </p>
        </Link>
      )}
    </div>
  );
}
