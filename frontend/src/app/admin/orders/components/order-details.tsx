/* eslint-disable @next/next/no-img-element */
"use client";
import { orderApiRequest } from "@/api-requests/order";
import { productApiRequest } from "@/api-requests/product";
import { handleErrorApi } from "@/lib/error";
import { OrderResType, StatusOrders } from "@/schemas/order.schema";
import { ProductResType } from "@/schemas/product.schema";
import { downloadFile } from "@/utils/download-file";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { JSX, useEffect, useState } from "react";

interface OrderDetailsProps {
  order?: OrderResType;
  onClose: () => void;
  loadOrders: () => void;
}

export default function OrderDetails({
  order,
  loadOrders,
  onClose,
}: OrderDetailsProps) {
  const [checkStock, setCheckStock] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const getPriceDiscount = (price: number, discount: number) => {
    const rawPriceDiscount =
      price && discount ? price - (price * discount) / 100 : price;
    const priceDiscount = rawPriceDiscount
      ? Number(rawPriceDiscount.toFixed(2))
      : 0;
    return priceDiscount;
  };

  const [products, setProducts] = useState<ProductResType[]>([]);
  const loadProducts = async () => {
    const orderItems = order?.items;
    const productIds = orderItems?.map((orderItem) => orderItem.product) || [];
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
  }, [order?.items]);

  const fetchCheckStock = async () => {
    try {
      if (order) {
        const checkStock = (await orderApiRequest.checkStock(order._id)).payload
          .checkStock;
        setCheckStock(checkStock);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCheckStock();
  }, [order?._id]);

  const updateOrderStatus = async (newStatus: StatusOrders) => {
    if (!order) return;
    try {
      switch (newStatus) {
        case StatusOrders.PROCESSING:
          await orderApiRequest.confirmOrder(order._id);
          break;
        case StatusOrders.SHIPPED:
          await orderApiRequest.shipOrder(order._id);
          break;
        case StatusOrders.DELIVERED:
          await orderApiRequest.deliverOrder(order._id);
          break;
        case StatusOrders.CANCEL:
          await orderApiRequest.cancelOrder(order._id);
          break;

        default:
          break;
      }
      onClose();
      loadOrders();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  const orderActionElements: Record<StatusOrders, JSX.Element | null> = {
    [StatusOrders.PENDING]: (
      <React.Fragment>
        <button
          onClick={() => updateOrderStatus(StatusOrders.PROCESSING)}
          disabled={!checkStock}
          className="disabled:cursor-not-allowed w-full p-2 border-2 border-black text-center cursor-pointer font-medium"
        >
          Confirm Order
        </button>
        <button
          onClick={() => updateOrderStatus(StatusOrders.CANCEL)}
          className="w-full p-2 border-2 text-red-500 border-black text-center cursor-pointer font-medium"
        >
          Cancel Order
        </button>
      </React.Fragment>
    ),
    [StatusOrders.PROCESSING]: (
      <React.Fragment>
        <button
          onClick={() => updateOrderStatus(StatusOrders.SHIPPED)}
          className="w-full p-2 border-2 border-black text-center cursor-pointer font-medium"
        >
          Ship Order
        </button>
        <button
          onClick={() => updateOrderStatus(StatusOrders.CANCEL)}
          className="w-full p-2 border-2 text-red-500 border-black text-center cursor-pointer font-medium"
        >
          Cancel Order
        </button>
      </React.Fragment>
    ),
    [StatusOrders.SHIPPED]: (
      <React.Fragment>
        <button
          onClick={() => updateOrderStatus(StatusOrders.DELIVERED)}
          className="w-full p-2 border-2 border-black text-center cursor-pointer font-medium"
        >
          Mark as Delivered
        </button>
        <button
          onClick={() => updateOrderStatus(StatusOrders.CANCEL)}
          className="w-full p-2 border-2 text-red-500 border-black text-center cursor-pointer font-medium"
        >
          Cancel Order
        </button>
      </React.Fragment>
    ),
    [StatusOrders.DELIVERED]: null,
    [StatusOrders.CANCEL]: null,
  };

  const downloadInvoice = async () => {
    if (!order) return;
    setDownloadLoading(true);
    try {
      const rsp = await orderApiRequest.downloadInvoice(order._id);
      downloadFile(rsp.payload, `${order.code}.pdf`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Contact Details */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <p className="text-gray-500 flex-1">Person</p>
          <p className="text-right flex-1">{order?.contactDetails.fullName}</p>
        </div>
        <div className="flex items-start justify-between gap-4">
          <p className="text-gray-500 flex-1">Phone</p>
          <p className="text-right flex-2">
            {order?.contactDetails.phoneNumber}
          </p>
        </div>
        <div className="flex items-start justify-between gap-4">
          <p className="text-gray-500 flex-1">Region</p>
          <p className="text-right flex-2">
            {order?.contactDetails.ward}, {order?.contactDetails.district},{" "}
            {order?.contactDetails.province}
          </p>
        </div>
        <div className="flex items-start justify-between gap-4">
          <p className="text-gray-500 flex-1">Address</p>
          <p className="text-right flex-2">{order?.contactDetails.address}</p>
        </div>
        {order?.note && (
          <div className="flex items-start justify-between gap-4">
            <p className="text-gray-500 flex-1">Note</p>
            <p className="text-right flex-2">{order.note}</p>
          </div>
        )}
      </div>
      <div
        className="border-t-2 border-dashed border-black"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, black 0, black 6px, transparent 6px, transparent 12px) 2",
        }}
      ></div>
      {/* Product items */}
      <div className="space-y-2">
        {order?.items.map((orderItem, index) => {
          const product = products.findLast(
            (product) => product._id === orderItem.product
          );

          let selectedVariantStock = product?.quantity || -1;
          // Tìm variant của product để lấy ra stock của variant đó
          if (orderItem.attributeVariant?.length !== 0) {
            const selectedAttributes = orderItem.attributeVariant || [];
            const selectedVariant = product?.variants?.findLast((variant) =>
              variant.attributes.every((attribute) =>
                selectedAttributes.some(
                  (selectedAttribute) =>
                    selectedAttribute.option === attribute.option &&
                    selectedAttribute.title === attribute.title
                )
              )
            );
            selectedVariantStock = selectedVariant?.quantity || -1;
          }
          return (
            <div key={index} className="flex gap-3">
              <img
                src={orderItem?.productSnapshot.image ?? ""}
                alt=""
                className="w-30 h-30 object-contain"
              />
              <div className="space-y-1">
                <p className="font-medium line-clamp-1">
                  {orderItem?.productSnapshot.name}
                </p>
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
                      orderItem.productSnapshot.price || 0,
                      orderItem.productSnapshot.discount || 0
                    ).toLocaleString("vi-VN")}
                    đ
                  </p>
                  {orderItem.productSnapshot.discount && (
                    <p className="font-medium text-gray-400 line-through">
                      {orderItem.productSnapshot.price.toLocaleString("vi-VN")}{" "}
                      đ
                    </p>
                  )}
                </div>
                <p>Quantity: {orderItem.quantity}</p>
                {order.status === StatusOrders.PENDING &&
                  selectedVariantStock !== -1 &&
                  orderItem.quantity > selectedVariantStock && (
                    <p className="text-orange-500 bg-orange-100 font-medium py-2 px-4">
                      Not enough stock
                    </p>
                  )}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="border-t-2 border-dashed border-black"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, black 0, black 6px, transparent 6px, transparent 12px) 2",
        }}
      ></div>
      {/* Price */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <p className="flex-1">Shipping Fee</p>
          {order?.deliveryPrice !== 0 ? (
            <p className="text-right flex-2 font-medium">
              {order?.deliveryPrice.toLocaleString("vi-VN")} VND
            </p>
          ) : (
            <p className="text-right flex-2 font-medium">Free</p>
          )}
        </div>
        <div className="flex items-start justify-between gap-4">
          <p className="flex-1">Total Price</p>
          <p className="text-right flex-2 font-medium">
            {order?.totalAmount.toLocaleString("vi-VN")} VND
          </p>
        </div>
      </div>
      <div
        className="border-t-2 border-dashed border-black"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, black 0, black 6px, transparent 6px, transparent 12px) 2",
        }}
      ></div>
      {order?.status && orderActionElements[order.status]}

      <button onClick={downloadInvoice} className="w-full">
        <p className="cursor-pointer p-3 bg-black flex justify-center gap-2 text-white font-medium text-center">
          {downloadLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          Download Invoice
        </p>
      </button>
    </div>
  );
}
