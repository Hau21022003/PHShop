/* eslint-disable @next/next/no-img-element */
import { ProductWithCategoryType } from "@/schemas/product.schema";
import React from "react";
import Link from "next/link";

interface ProductItemProps {
  product: ProductWithCategoryType;
}
export default function ProductItem({ product }: ProductItemProps) {
  const getPriceDiscount = (price: number, discount: number) => {
    const rawPriceDiscount =
      price && discount ? price - (price * discount) / 100 : price;
    const priceDiscount = rawPriceDiscount
      ? Number(rawPriceDiscount.toFixed(2))
      : 0;
    return Intl.NumberFormat("vi-VN", {
      useGrouping: true,
      maximumFractionDigits: 0,
    }).format(priceDiscount);
  };
  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <div className="relative group">
        {/* Ảnh 1 */}
        <img
          className="w-full aspect-square object-cover cursor-pointer transition-opacity duration-300 group-hover:opacity-0"
          src={product.images[0] || ""}
          alt=""
        />
        {/* Ảnh 2 */}
        {product.images.length > 1 && (
          <img
            className="w-full aspect-square object-cover cursor-pointer absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            src={product.images[1]}
            alt=""
          />
        )}
        {product.quantity === 0 && (
          <div
            className="absolute inset-0 w-full aspect-square bg-black/70 text-white
            flex items-center justify-center uppercase text-lg font-bold tracking-wider"
          >
            Out of stock
          </div>
        )}

        {/* Nút BUY NOW */}
        <div className="cursor-pointer font-bold whitespace-nowrap text-xl absolute bottom-0 left-1/2 -translate-x-1/2 bg-orange-500 bg-opacity-80 text-white py-2 px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          BUY NOW
        </div>
      </div>
      <Link
        href={`/product-detail/${product._id}`}
        className="text-base hover:text-orange-500 hover:underline hover:underline-offset-4 line-clamp-1"
      >
        {product.name}
      </Link>
      <div className="w-full flex flex-wrap justify-center gap-4">
        <p className="text-base font-medium">
          {getPriceDiscount(product.price, product.discount || 0)} VND
        </p>
        {product.discount && (
          <p className="text-gray-400 line-through">
            {product.price.toLocaleString("vi-VN")} VND
          </p>
        )}
      </div>
    </div>
  );
}
