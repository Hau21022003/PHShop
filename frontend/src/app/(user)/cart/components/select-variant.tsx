"use client";
import { useCartContext } from "@/app/(user)/cart/cart-provider";
import { useUserContext } from "@/app/(user)/user-provider";
import { handleErrorApi } from "@/lib/error";
import { cartService } from "@/lib/user/cart/cart-service";
import { CartItemBody, CartItemResType } from "@/schemas/cart.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

interface SelectVariantProps {
  cartItem: CartItemResType;
  onCancel?: () => void; // thêm prop
}

export default function VariantSelector({
  cartItem,
  onCancel,
}: SelectVariantProps) {
  const form = useForm({
    resolver: zodResolver(CartItemBody),
    defaultValues: {
      attributeVariant: cartItem.attributeVariant,
      quantity: cartItem.quantity,
      product: cartItem.product?._id,
      snapshot: cartItem.snapshot,
    },
  });
  const { loadCart } = useUserContext();
  const { setCartItems } = useCartContext();
  //   const [errorSelectVariant, setErrorSelectVariant] = useState(false);

  const handleSelectVariantOption = (title: string, option: string) => {
    const attributeVariants = form.getValues("attributeVariant") || [];

    const exists = attributeVariants.find(
      (attr) => attr.title === title && attr.option === option
    );

    let updatedAttributes;

    if (exists) {
      updatedAttributes = attributeVariants.filter(
        (attr) => !(attr.title === title && attr.option === option)
      );
    } else {
      updatedAttributes = [
        ...attributeVariants.filter((attr) => attr.title !== title),
        { title, option },
      ];
    }

    form.setValue("attributeVariant", updatedAttributes);
  };

  const isVariantSelectionIncomplete = () => {
    if (!cartItem?.product || cartItem.product.variantStructure.length === 0)
      return false;
    // Trạng thái mới giống cũ:
    const isNotChange = cartItem.attributeVariant?.every((attribute) =>
      form
        .getValues("attributeVariant")
        ?.some(
          (formAttribute) =>
            formAttribute.option === attribute.option &&
            formAttribute.title === attribute.title
        )
    );
    if (isNotChange) return true;

    // Chưa chọn xong
    const selected = cartItem.product.variantStructure.every((variant) => {
      const selectedVariants = form.getValues("attributeVariant");
      if (!selectedVariants) return false;
      return selectedVariants.some(
        (selectedVariant) => selectedVariant.title === variant.title
      );
    });
    return !selected;
  };

  const updateCartItem = async () => {
    if (isVariantSelectionIncomplete()) {
      return;
    }
    try {
      const newCartItem = await cartService.updateCartItem(
        cartItem._id,
        form.getValues()
      );
      if (!newCartItem) return;
      setCartItems((prev) =>
        prev.map((item) => (item._id === cartItem._id ? newCartItem : item))
      );
      loadCart();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  return (
    <div className="space-y-4">
      {cartItem.product?.variantStructure.map((variant, idx) => (
        <div
          key={idx}
          className={`w-full flex gap-2 flex-col sm:flex-row sm:items-start`}
        >
          <p className="text-base text-gray-500 w-[20%] flex-shrink-0 sm:truncate">
            {variant.title}
          </p>
          <div className="flex flex-wrap gap-2">
            {/* Item */}

            {variant.options.map((option, optionIndex) => {
              const optionTotalQuantity =
                cartItem?.product?.variants?.reduce((quantity, item) => {
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
                cartItem?.product?.variants?.reduce(
                  (quantity, productVariant) => {
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
                  },
                  0
                ) || 0;

              return (
                <div
                  key={`${idx}_option_${optionIndex}`}
                  className={`${
                    option.image ? "" : "min-w-20 justify-center"
                  } relative px-2 w-auto h-10 flex gap-2 items-center border cursor-pointer
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
                  onClick={() =>
                    handleSelectVariantOption(variant.title, option.option)
                  }
                >
                  {option.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={option.image}
                      alt=""
                      className="w-7 h-7 object-cover"
                    />
                  )}

                  <p className="leading-none text-base">{option.option}</p>
                  {form
                    .watch("attributeVariant")
                    ?.some(
                      (attr) =>
                        attr.option === option.option &&
                        attr.title === variant.title
                    ) && (
                    <span
                      className="absolute top-0 right-0 
                      w-0 h-0 
                      border-l-[12px] border-l-transparent 
                      border-t-[12px] border-t-black"
                    ></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="border-t border-gray-200 mt-4"></div>
      <div className="mt-4 flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="cursor-pointer p-2 px-4 border-2 border-black"
        >
          Cancel
        </button>
        <button
          onClick={updateCartItem}
          disabled={isVariantSelectionIncomplete()}
          className="cursor-pointer p-2 px-4 bg-orange-600 text-white disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
