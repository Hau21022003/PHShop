/* eslint-disable @next/next/no-img-element */
import { orderApiRequest } from "@/api-requests/order";
import { productApiRequest } from "@/api-requests/product";
import { handleErrorApi } from "@/lib/error";
import { CreateOrderType, ShippingFeeSchema } from "@/schemas/order.schema";
import { ProductResType } from "@/schemas/product.schema";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface OrderSummaryProps {
  orderForm: UseFormReturn<CreateOrderType>;
}

export default function OrderSummary({ orderForm }: OrderSummaryProps) {
  const [products, setProducts] = useState<ProductResType[]>([]);
  const [shippingFee, setShippingFee] = useState(0);
  const loadProducts = async () => {
    const orderItems = orderForm.watch("items");
    const productIds = orderItems.map((orderItem) => orderItem.product);
    const products = await Promise.all(
      productIds.map(
        async (productId) =>
          (
            await productApiRequest.findOne(productId)
          ).payload
      )
    );
    setProducts(products);
  };

  useEffect(() => {
    loadProducts();
  }, [orderForm.watch("items")]);

  const getPriceDiscount = (price: number, discount: number) => {
    const rawPriceDiscount =
      price && discount ? price - (price * discount) / 100 : price;
    const priceDiscount = rawPriceDiscount
      ? Number(rawPriceDiscount.toFixed(2))
      : 0;
    return priceDiscount;
  };

  const isSameAttributes = (
    a: { title: string; option: string }[],
    b: { title: string; option: string }[]
  ) => {
    if (a.length !== b.length) return false;
    return a.every((attr) =>
      b.some((x) => x.title === attr.title && x.option === attr.option)
    );
  };

  const getSubtotal = () => {
    const orderItems = orderForm.watch("items");
    const total = orderItems.reduce((sum, orderItem) => {
      const product = products.findLast(
        (product) => product._id === orderItem.product
      );
      const variantProduct = product?.variants?.findLast((variant) =>
        isSameAttributes(
          variant.attributes || [],
          orderItem.attributeVariant || []
        )
      );
      const price = variantProduct?.price || product?.price || 0;
      return (
        sum +
        getPriceDiscount(orderItem.quantity * price, product?.discount || 0)
      );
    }, 0);
    return total;
  };

  const loadShippingFee = async () => {
    try {
      const data = {
        items: orderForm.getValues("items"),
        districtId: orderForm.getValues("contactDetails.district"),
        provinceId: orderForm.getValues("contactDetails.province"),
        wardId: orderForm.getValues("contactDetails.ward"),
      };

      const parseResult = ShippingFeeSchema.safeParse(data);

      if (!parseResult.success) {
        return;
      }

      const rsp = await orderApiRequest.calcShippingFee(parseResult.data);
      const shippingFee = rsp.payload;
      setShippingFee(shippingFee.shippingFee);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  useEffect(() => {
    loadShippingFee();
  }, [orderForm.watch("contactDetails.ward")]);

  return (
    <div className="p-4 border-2 border-black space-y-4">
      <p className="uppercase font-medium">Your Order</p>
      <div className="border-t-2 border-black"></div>
      {/* Product list */}
      <div className="space-y-4">
        {orderForm.watch("items").map((orderItem, index) => {
          const product = products.findLast(
            (product) => product._id === orderItem.product
          );
          return (
            <div key={index} className="flex gap-3">
              <img
                src={product?.images.length !== 0 ? product?.images[0] : ""}
                alt=""
                className="w-30 h-30 object-contain"
              />
              <div className="space-y-1">
                <p className="font-medium line-clamp-1">{product?.name}</p>
                {orderItem.attributeVariant?.length !== 0 && (
                  <p>
                    {orderItem.attributeVariant?.reduce(
                      (acc, item, idx) =>
                        idx !== 0
                          ? acc + ", " + item.option
                          : acc + item.option,
                      ""
                    )}
                  </p>
                )}
                <div className="flex gap-2 flex-wrap">
                  <p className="font-medium">
                    {getPriceDiscount(
                      product?.price || 0,
                      product?.discount || 0
                    ).toLocaleString("vi-VN")}
                    đ
                  </p>
                  {product?.discount && (
                    <p className="font-medium text-gray-400 line-through">
                      {product.price.toLocaleString("vi-VN")} đ
                    </p>
                  )}
                </div>
                <p>Quantity: {orderItem.quantity}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t-2 border-black"></div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="font-medium">Subtotal</p>
          <p>{getSubtotal().toLocaleString("vi-VN")}đ</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Shipping</p>
          {shippingFee === 0 ? (
            <p>Free</p>
          ) : (
            <p>{shippingFee.toLocaleString("vi-VN")}đ</p>
          )}
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Total</p>
          <p>{(getSubtotal() + shippingFee).toLocaleString("vi-VN")}đ</p>
        </div>
      </div>
      <div className="border-t-2 border-black"></div>
      <button
        type="submit"
        className="cursor-pointer p-3 w-full bg-black text-white font-medium text-center"
      >
        Checkout
      </button>
    </div>
  );
}
