/* eslint-disable @next/next/no-img-element */
import { ProductWithCategoryType } from "@/schemas/product.schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    <div
      className="w-full flex flex-col gap-2 items-center"
      onClick={() => {
        redirect(`/product-detail/${product._id}`);
      }}
    >
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

        {/* Nút BUY NOW */}
        <div className="cursor-pointer font-bold whitespace-nowrap text-xl absolute bottom-0 left-1/2 -translate-x-1/2 bg-orange-500 bg-opacity-80 text-white py-2 px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          BUY NOW
        </div>

        {/* Icon Heart */}
        <button className="cursor-pointer absolute bottom-1 right-2">
          <FontAwesomeIcon
            icon={faHeartRegular}
            className="text-orange-500 w-20 h-20"
            size="2x"
          />
        </button>
      </div>
      <Link
        href={``}
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
