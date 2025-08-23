/* eslint-disable @next/next/no-img-element */
"use client";
import { ProductDetailType } from "@/schemas/product.schema";
import React, { Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { Minus, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CartItemBody } from "@/schemas/cart.schema";
import { handleErrorApi } from "@/lib/error";
import { cartService } from "@/lib/user/cart/cart-service";
import { useUserContext } from "@/app/(user)/user-provider";
import { toast } from "sonner";
import { useProductDetailContext } from "@/app/(user)/product-detail/[id]/product-detail-provider";
import Link from "next/link";
import { CheckoutPayload } from "@/schemas/checkout.schema";
interface ProductDetailProps {
  product?: ProductDetailType;
}
export default function ProductDetail({ product }: ProductDetailProps) {
  const { setSelectedImage } = useProductDetailContext();
  const { loadCart } = useUserContext();
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

  const form = useForm({
    resolver: zodResolver(CartItemBody),
    defaultValues: {
      attributeVariant: [],
      quantity: 1,
    },
  });
  const [errorSelectVariant, setErrorSelectVariant] = useState(false);
  const [stock, setStoke] = useState(product?.quantity || 0);

  const isVariantSelectionIncomplete = () => {
    if (!product || product.variantStructure.length === 0) return false;
    const selected = product.variantStructure.every((variant) => {
      const selectedVariants = form.getValues("attributeVariant");
      if (!selectedVariants) return false;
      return selectedVariants.some(
        (selectedVariant) => selectedVariant.title === variant.title
      );
    });
    return !selected;
  };

  useEffect(() => {
    setStoke(product?.quantity || 0);
    if (product) {
      form.reset({
        attributeVariant: [],
        quantity: 1,
        product: product?._id,
        snapshot: {
          image: product.images.length > 0 ? product?.images[0] : "",
          name: product.name,
          price: product.price,
        },
      });
    }
  }, [product]);

  useEffect(() => {
    if (errorSelectVariant && !isVariantSelectionIncomplete()) {
      setErrorSelectVariant(false);
    }

    if (
      !isVariantSelectionIncomplete() &&
      product?.variantStructure.length !== 0
    ) {
      const selectedAttributes = form.getValues("attributeVariant") || [];
      const selectedVariant = product?.variants?.findLast((variant) =>
        variant.attributes.every((attribute) =>
          selectedAttributes.some(
            (selectedAttribute) =>
              selectedAttribute.option === attribute.option &&
              selectedAttribute.title === attribute.title
          )
        )
      );
      const selectedVariantStock = selectedVariant?.quantity || 0;
      form.setValue("quantity", 1);
      setStoke(selectedVariantStock);
    }
  }, [form.getValues("attributeVariant")]);

  const increaseQuantity = () => {
    const quantity = form.watch("quantity");
    if (quantity < stock) {
      form.setValue("quantity", quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    const quantity = form.watch("quantity");
    if (quantity >= 2) {
      form.setValue("quantity", quantity - 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);

    if (isNaN(value)) {
      value = 1;
    }

    if (value < 1) value = 1;
    if (stock && value > stock) value = stock;

    form.setValue("quantity", value, { shouldValidate: true });
  };

  const handleSelectVariantOption = (title: string, option: string) => {
    const attributeVariants = form.getValues("attributeVariant") || [];

    const exists = attributeVariants.find(
      (attr) => attr.title === title && attr.option === option
    );

    let updatedAttributes;

    if (exists) {
      // Nếu trùng cả title + option => xóa đi
      updatedAttributes = attributeVariants.filter(
        (attr) => !(attr.title === title && attr.option === option)
      );
    } else {
      // Nếu khác => xóa cái cũ cùng title, thêm cái mới
      updatedAttributes = [
        ...attributeVariants.filter((attr) => attr.title !== title),
        { title, option },
      ];
    }

    form.setValue("attributeVariant", updatedAttributes);
  };

  const addCart = async () => {
    if (isVariantSelectionIncomplete()) {
      setErrorSelectVariant(true);
      return;
    }
    try {
      // await cartApiRequest.createCartItem(form.getValues());
      await cartService.addCartItem(form.getValues());
      toast.success("Success", {
        duration: 1000,
        description: "Product has been added to your cart",
      });
      loadCart();
      // console.log("getCart", await cartService.getCart());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  const encodeBase64 = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  const generateCheckoutPayload = () => {
    if (isVariantSelectionIncomplete()) {
      setErrorSelectVariant(true);
      return "";
    }
    try {
      const obj: CheckoutPayload = {
        product: form.getValues("product"),
        quantity: form.getValues("quantity"),
        attributes: form.getValues("attributeVariant"),
      };
      const str = JSON.stringify(obj);
      const encoded = encodeBase64(str);
      return encoded;
    } catch (error) {
      console.log(error);
    }
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
      <div className="mt-8 space-y-4">
        {product?.variantStructure.map((variant, idx) => (
          <div
            key={idx}
            className={`w-full flex gap-2 flex-col sm:flex-row sm:items-center`}
          >
            <p className="text-base text-gray-500 w-[20%] flex-shrink-0 sm:truncate">
              {variant.title}
            </p>
            <div className="flex flex-wrap gap-2">
              {/* Item */}

              {variant.options.map((option, optionIndex) => {
                const optionTotalQuantity =
                  product.variants?.reduce((quantity, item) => {
                    if (
                      item.attributes.some(
                        (attribute) =>
                          variant.title === attribute.title &&
                          option.option === attribute.option
                      )
                    ) {
                      return quantity + item.quantity;
                    } else return quantity;
                  }, 0) || 0;

                const selectedAttributes = form.watch("attributeVariant") || [];

                const availableQuantityForOption =
                  product.variants?.reduce((quantity, productVariant) => {
                    const otherSelectedAttributes = selectedAttributes.filter(
                      (selectedAttribute) =>
                        selectedAttribute.title !== variant.title
                    );
                    const hasAllSelectedAttributes =
                      otherSelectedAttributes.every((selectedAttribute) => {
                        return (
                          productVariant.attributes.some(
                            (attribute) =>
                              attribute.title === selectedAttribute.title &&
                              attribute.option === selectedAttribute.option
                          ) &&
                          productVariant.attributes.some(
                            (attribute) =>
                              attribute.title === variant.title &&
                              attribute.option === option.option
                          )
                        );
                      });
                    if (hasAllSelectedAttributes) {
                      return productVariant.quantity + quantity;
                    }

                    return quantity;
                  }, 0) || 0;

                return (
                  <div
                    key={`${idx}_option_${optionIndex}`}
                    className={`${
                      option.image ? "" : "min-w-20 justify-center"
                    } px-2 w-auto h-10 flex gap-2 items-center border cursor-pointer
                    ${
                      optionTotalQuantity > 0
                        ? ""
                        : "bg-gray-200 pointer-events-none"
                    }
                    ${
                      selectedAttributes.length === 0 ||
                      availableQuantityForOption > 0
                        ? ""
                        : "bg-gray-200 pointer-events-none"
                    }
                    ${
                      form
                        .watch("attributeVariant")
                        ?.some(
                          (attr) =>
                            attr.option === option.option &&
                            attr.title === variant.title
                        )
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    onClick={() => {
                      handleSelectVariantOption(variant.title, option.option);
                      if (option.image) setSelectedImage(option.image);
                    }}
                  >
                    {option.image && (
                      <img
                        src={option.image}
                        alt=""
                        className="w-7 h-7 object-cover"
                      />
                    )}
                    <p className="leading-none text-base">{option.option}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* quantity */}
      <div className={`mt-4 flex items-center gap-2`}>
        <p className="text-gray-500 w-[20%]">Quantity</p>
        <div
          className={`flex items-center border border-gray-300 ${
            isVariantSelectionIncomplete()
              ? "opacity-60 pointer-events-none"
              : ""
          }`}
        >
          <button
            onClick={decreaseQuantity}
            disabled={form.watch("quantity") <= 1}
            className="p-1 px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>

          <div className="px-3 py-1  bg-white border-x border-gray-300">
            <input
              type="number"
              value={form.watch("quantity")}
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
            disabled={form.watch("quantity") >= stock}
            className="p-1 px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        {product?.variantStructure.length !== 0 &&
          isVariantSelectionIncomplete() &&
          stock > 0 && (
            <p className="ml-4 text-gray-400 uppercase leading-none">
              Available
            </p>
          )}
        {!isVariantSelectionIncomplete() && (
          <p className={`ml-4 text-gray-400 leading-none`}>
            {stock} products available
          </p>
        )}
      </div>

      {errorSelectVariant && (
        <p className="mt-4 text-red-600">Please select product category</p>
      )}

      {/* Button buy - add cart */}
      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        <button
          onClick={addCart}
          className="cursor-pointer w-full lg:w-50 p-4 flex items-center justify-center gap-3 bg-black text-white font-medium"
        >
          <FontAwesomeIcon icon={faCartPlus} size="lg" className="w-6 h-6" />
          <p>Add To Bag</p>
        </button>
        {isVariantSelectionIncomplete() ? (
          <button
            onClick={() => {
              if (isVariantSelectionIncomplete()) setErrorSelectVariant(true);
            }}
            // disabled={isVariantSelectionIncomplete()}
            className="cursor-pointer w-full lg:w-50 p-4 flex items-center justify-center border border-gray-400 font-medium"
          >
            Buy Now
          </button>
        ) : (
          <Link href={`/checkout?payload=${generateCheckoutPayload()}`}>
            <p className="cursor-pointer w-full lg:w-50 p-4 flex items-center justify-center border border-gray-400 font-medium">
              Buy Now
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
