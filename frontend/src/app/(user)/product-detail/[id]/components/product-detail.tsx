/* eslint-disable @next/next/no-img-element */
import { ProductDetailType } from "@/schemas/product.schema";
import React, { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { Minus, Plus } from "lucide-react";
interface ProductDetailProps {
  product?: ProductDetailType;
}
export default function ProductDetail({ product }: ProductDetailProps) {
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
    <div className="space-y-2">
      {/* Name */}
      <div className="space-y-1">
        <p className="text-lg">{product?.name}</p>
        <p className="text-base text-gray-400">{product?.category?.name}</p>
      </div>
      {/* Star - previews - sold */}
      <div className="items-stretch flex gap-3">
        <div className="flex items-center gap-2">
          <p className="leading-none">4.9</p>
          <FontAwesomeIcon
            icon={faStar}
            size="xs"
            className="text-orange-500"
          />
        </div>
        <div className="border-l border-gray-300"></div>
        <p className="leading-none">20 Reviews</p>
        <div className="border-l border-gray-300"></div>
        <p className="leading-none">60 Sold</p>
      </div>
      {/* Price */}
      <div className="mt-8 p-5 bg-gray-50 flex items-center flex-wrap gap-3">
        <p className="leading-none text-2xl font-medium">
          {getPriceDiscount(product?.price || 0, product?.discount || 0)} VND
        </p>
        {product?.discount && (
          <Fragment>
            <p className="leading-none text-base text-gray-400 line-through">
              {product.price.toLocaleString("vi-VN")} VND
            </p>
            <p className="leading-none text-sm font-medium text-orange-500 bg-orange-100 p-1">
              -{product.discount}%
            </p>
          </Fragment>
        )}
      </div>
      {/* Variant */}
      <div className="mt-8 flex gap-2 flex-col sm:flex-row sm:items-center">
        <p className="text-base text-gray-500 w-[20%] sm:truncate">Màu sắc</p>
        <div className="flex flex-wrap gap-2">
          {/* Item */}
          <div className="px-2 w-auto min-w-26 h-10 flex gap-2 items-center border border-gray-300 cursor-pointer hover:border-black">
            <img src="" alt="" className="w-7 h-7 object-cover" />
            <p className="leading-none text-base">HH</p>
          </div>
          {/* Item */}
          <div className="px-2 w-auto min-w-26 h-10 flex gap-2 items-center justify-center border border-gray-300">
            <p className="leading-none">HH</p>
          </div>
        </div>
      </div>
      {/* quantity */}
      <div className="mt-8 flex items-center gap-2">
        <p className="text-gray-500 w-[20%]">Quantity</p>
        <div className="flex items-center border border-gray-300 ">
          <button
            // onClick={decreaseQuantity}
            // disabled={quantity <= 1}
            className="p-1 px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>

          <div className="px-4 py-1  bg-white border-x border-gray-300">
            <input
              type="number"
              // value={quantity}
              // onChange={handleInputChange}
              min="1"
              // max={stock}
              // className="w-12 text-center font-semibold text-gray-800 outline-none bg-transparent"
              className="w-8 text-center text-gray-800 outline-none bg-transparent 
              [&::-webkit-inner-spin-button]:appearance-none 
              [&::-webkit-outer-spin-button]:appearance-none 
              [appearance:textfield]"
            />
          </div>

          <button
            // onClick={increaseQuantity}
            // disabled={quantity >= stock}
            className="p-1 px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      {/* Button buy - add cart */}
      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        <button className="cursor-pointer w-full lg:w-50 p-4 flex items-center justify-center gap-3 bg-black text-white font-medium">
          <FontAwesomeIcon icon={faCartPlus} size="lg" className="w-6 h-6" />
          <p>Add To Bag</p>
        </button>
        <button className="cursor-pointer w-full lg:w-50 p-4 flex items-center justify-center border border-gray-400 font-medium">
          Buy Now
        </button>
      </div>
    </div>
  );
}
