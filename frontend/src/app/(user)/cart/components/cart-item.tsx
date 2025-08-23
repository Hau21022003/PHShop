/* eslint-disable @next/next/no-img-element */
"use client";
import { useCartContext } from "@/app/(user)/cart/cart-provider";
import VariantSelector from "@/app/(user)/cart/components/select-variant";
import { useUserContext } from "@/app/(user)/user-provider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { handleErrorApi } from "@/lib/error";
import { cartService } from "@/lib/user/cart/cart-service";
import { CartItemResType } from "@/schemas/cart.schema";
import { ChevronDown, Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";

interface CartItemProps {
  item: CartItemResType;
}

export default function CartItem({ item }: CartItemProps) {
  const { setCartItems, selectedCartIds, setSelectedCartIds } =
    useCartContext();
  const { loadCart } = useUserContext();
  const [stock, setStoke] = useState(item.product?.quantity || 0);
  const [isVariantSelectorOpen, setIsVariantSelectorOpen] = useState(false);

  // Load stock
  useEffect(() => {
    if (item.attributeVariant?.length === 0) return;

    const selectedAttributes = item.attributeVariant || [];
    const selectedVariant = item.product?.variants?.findLast((variant) =>
      variant.attributes.every((attribute) =>
        selectedAttributes.some(
          (selectedAttribute) =>
            selectedAttribute.option === attribute.option &&
            selectedAttribute.title === attribute.title
        )
      )
    );
    const selectedVariantStock = selectedVariant?.quantity || 0;
    setStoke(selectedVariantStock);
  }, []);

  const getPriceDiscount = (price: number, discount: number) => {
    const rawPriceDiscount =
      price && discount ? price - (price * discount) / 100 : price;
    const priceDiscount = rawPriceDiscount
      ? Number(rawPriceDiscount.toFixed(2))
      : 0;
    return priceDiscount;
  };

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > stock) return;

    try {
      const newCartItem = await cartService.updateCartItem(item._id, {
        quantity: newQuantity,
      });
      setCartItems((prev) =>
        prev.map((cartItem) =>
          cartItem._id === item._id ? newCartItem : cartItem
        )
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  const increaseQuantity = () => {
    updateQuantity(item.quantity + 1);
  };

  const decreaseQuantity = () => {
    updateQuantity(item.quantity - 1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 1;
    if (value < 1) value = 1;
    if (stock && value > stock) value = stock;

    updateQuantity(value);
  };

  const removeCartItem = async () => {
    const id = item._id;
    try {
      await cartService.removeCartItem(id);
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      loadCart();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  return (
    <div>
      <div className="flex items-start gap-4">
        {/* Image and checkbox */}
        <div className="flex items-center">
          <Checkbox
            disabled={item.quantity > stock}
            checked={selectedCartIds.includes(item._id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedCartIds((prev) => [...prev, item._id]);
              } else {
                setSelectedCartIds((prev) =>
                  prev.filter((id) => id !== item._id)
                );
              }
            }}
            className="mr-6 w-6 h-6 [&_svg]:w-5 [&_svg]:h-5 rounded-none border-2"
          />
          <Link href={`/product-detail/${item.product?._id}`}>
            <img
              src={item.snapshot.image}
              alt=""
              className="w-40 h-40 object-cover cursor-pointer"
            />
          </Link>
        </div>
        <div className="flex-1 space-y-6">
          {/* Name */}
          <div className="mt-2 flex justify-between gap-2">
            <Link
              className="max-w-[70%]"
              href={`/product-detail/${item.product?._id}`}
            >
              <p className="text-lg font-medium line-clamp-2">
                {item.snapshot.name}
              </p>
            </Link>
            <X className="w-7 h-7 cursor-pointer" onClick={removeCartItem} />
          </div>
          <div className="flex flex-wrap justify-between items-end gap-2">
            {/* Option */}
            {item.attributeVariant?.length !== 0 ? (
              <Popover
                open={isVariantSelectorOpen}
                onOpenChange={setIsVariantSelectorOpen}
              >
                <PopoverTrigger>
                  <div className="p-2 border-2 border-black flex items-center gap-4 max-w-64">
                    <p className="truncate flex-1">
                      {item.attributeVariant?.reduce((acc, option, index) => {
                        if (index == 0) return option.option;
                        return acc + ", " + option.option;
                      }, "")}
                    </p>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-96">
                  <VariantSelector
                    cartItem={item}
                    onCancel={() => setIsVariantSelectorOpen(false)}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div></div>
            )}
            {/* Quantity */}
            <div className="">
              {item.quantity > stock && (
                <p className="text-orange-600">Not enough stock</p>
              )}
              <div className="p-2 border-2 border-black flex items-center">
                <button
                  onClick={decreaseQuantity}
                  disabled={item.quantity <= 1}
                  className="p-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="px-3">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={stock}
                    className="w-8 text-center text-gray-800 outline-none bg-transparent
                    [&::-webkit-inner-spin-button]:appearance-none 
                    [&::-webkit-outer-spin-button]:appearance-none 
                    [appearance:textfield]"
                  />
                </div>
                <button
                  onClick={increaseQuantity}
                  disabled={item.quantity >= stock}
                  className="p-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          {/* Price and add favorites */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="cursor-pointer uppercase underline underline-offset-2">
              Move to favorites
            </p>
            <div className="flex gap-4">
              <p className="text-lg font-medium">
                {getPriceDiscount(
                  item.quantity * item.snapshot.price,
                  item.snapshot.discount || 0
                ).toLocaleString("vi-VN")}
                đ
              </p>
              {item.product?.discount && (
                <Fragment>
                  <p className="text-lg text-gray-400 line-through">
                    {(item.quantity * item.snapshot.price).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    VND
                  </p>
                  <p className="text-sm font-medium text-orange-500 bg-orange-100 p-1">
                    -{item.snapshot.discount}%
                  </p>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
      {item.quantity > stock && (
        <p className="mt-4 p-2 text-center bg-orange-200">
          Currently unavailable in the selected options/quantity.
        </p>
      )}
    </div>
  );
}
