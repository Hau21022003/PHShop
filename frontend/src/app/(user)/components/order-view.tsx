/* eslint-disable @next/next/no-img-element */
import { orderApiRequest } from "@/api-requests/order";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import { AccountType } from "@/schemas/account.schema";
import { OrderResType, StatusOrders } from "@/schemas/order.schema";
import { extractTime, formatDateShort } from "@/utils/time";
import React, { Fragment } from "react";
import { toast } from "sonner";

export default function OrderView({
  order,
  user,
  fetchOrder,
}: {
  order: OrderResType;
  user: AccountType | null;
  fetchOrder: () => void;
}) {
  const statusOrderLabel: Record<StatusOrders, string> = {
    [StatusOrders.PENDING]: "Pending",
    [StatusOrders.PROCESSING]: "Confirmed",
    [StatusOrders.SHIPPED]: "Shipped",
    [StatusOrders.CANCEL]: "Cancel",
    [StatusOrders.DELIVERED]: "Delivered",
  };

  const getPriceDiscount = (price: number, discount: number) => {
    const rawPriceDiscount =
      price && discount ? price - (price * discount) / 100 : price;
    const priceDiscount = rawPriceDiscount
      ? Number(rawPriceDiscount.toFixed(2))
      : 0;
    return priceDiscount;
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await orderApiRequest.cancelOrderByUser(orderId);
      fetchOrder();
      toast.success("Success", {
        duration: 1000,
        description: "Cancel order success",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  return (
    <div className="border-2 border-black p-4 space-y-4">
      <div className="flex gap-2 justify-between flex-col sm:flex-row sm:items-start">
        <div className="space-y-2">
          <p className="text-lg font-bold uppercase">Order #: {order.code}</p>
          <div className="flex gap-2 items-center flex-wrap text-gray-500">
            <p>{order.items.length} Products</p>
            <div className="h-4 border-l-2 border-gray-400"></div>
            <p>By {order.contactDetails.fullName}</p>
            <div className="h-4 border-l-2 border-gray-400"></div>
            <p>
              {extractTime(order.createdAt)}, {formatDateShort(order.createdAt)}
            </p>
          </div>
        </div>
        {user?._id === order.user && order.status === StatusOrders.PENDING && (
          <button
            onClick={() => cancelOrder(order._id)}
            className="bg-red-100 text-black font-medium px-4 py-2 cursor-pointer border-2 border-black"
          >
            Cancel Order
          </button>
        )}
        {user?._id === order.user &&
          order.status === StatusOrders.DELIVERED &&
          !order.isReviewed && (
            <button className="bg-green-100 text-black font-medium px-4 py-2 cursor-pointer border-2 border-black">
              Review
            </button>
          )}
      </div>
      <div className="border-t-2 border-black"></div>
      <div className="space-y-2">
        <div className="flex gap-2 items-start">
          <p className="w-40 text-gray-500 shrink-0">Status</p>
          <p
            className={cn(
              "font-medium",
              order.status === StatusOrders.PENDING ? "text-yellow-500" : "",
              order.status === StatusOrders.PROCESSING ? "text-blue-500" : "",
              order.status === StatusOrders.SHIPPED ? "text-indigo-500" : "",
              order.status === StatusOrders.DELIVERED ? "text-green-500" : "",
              order.status === StatusOrders.CANCEL ? "text-red-500" : ""
            )}
          >
            {statusOrderLabel[order.status]}
          </p>
        </div>
        {order.statusHistory &&
          order.statusHistory.findLast(
            (item) => item.status === order.status
          ) && (
            <div className="flex gap-2 items-start">
              <p className="w-40 text-gray-500 shrink-0">
                {statusOrderLabel[order.status]} At
              </p>
              <p>
                {extractTime(
                  order.statusHistory.findLast(
                    (item) => item.status === order.status
                  )?.changedAt || ""
                )}
                ,{" "}
                {formatDateShort(
                  order.statusHistory.findLast(
                    (item) => item.status === order.status
                  )?.changedAt || ""
                )}
              </p>
            </div>
          )}
        <div className="flex gap-2 items-start">
          <p className="w-40 text-gray-500 shrink-0">Delivery Region</p>
          <p>
            {order.contactDetails.ward}, {order.contactDetails.district},{" "}
            {order.contactDetails.province}.
          </p>
        </div>
        <div className="flex gap-2 items-start">
          <p className="w-40 text-gray-500 shrink-0">Delivery Address</p>
          <p>{order.contactDetails.address}</p>
        </div>
        <div className="flex gap-2 items-start">
          <p className="w-40 text-gray-500 shrink-0">Phone Number</p>
          <p>{order.contactDetails.phoneNumber}</p>
        </div>
        <div className="flex gap-2 items-start">
          <p className="w-40 font-bold shrink-0">Total</p>
          <p className="font-bold">
            {order.totalAmount.toLocaleString("vi-VN")} VND
          </p>
        </div>
      </div>
      <div className="border-t-2 border-black"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {order.items.map((orderItem, index) => (
          <div key={index} className="flex gap-2">
            <img
              className="w-40 h-40 shrink-0"
              alt=""
              src={orderItem.productSnapshot.image}
            />
            <div className="space-y-1 text-gray-500">
              <p className="font-medium line-clamp-1 text-black">
                {orderItem.productSnapshot.name}
              </p>
              {orderItem.attributeVariant?.length !== 0 && (
                <p>
                  {orderItem.attributeVariant?.reduce(
                    (acc, item, idx) =>
                      idx !== 0
                        ? acc + `, ${item.title}: ${item.option}`
                        : acc + `${item.title}: ${item.option}`,
                    ""
                  )}
                </p>
              )}
              <p className="">Quantity: x{orderItem.quantity} </p>
              <div className="flex gap-2 flex-wrap">
                <p className="">
                  {getPriceDiscount(
                    orderItem.productSnapshot.price,
                    orderItem.productSnapshot.discount || 0
                  ).toLocaleString("vi-VN")}{" "}
                  VND
                </p>
                {orderItem.productSnapshot.discount && (
                  <Fragment>
                    <p className="line-through">
                      {orderItem.productSnapshot.price.toLocaleString("vi-VN")}{" "}
                      VND
                    </p>
                    <p className="font-medium text-orange-500">
                      -{orderItem.productSnapshot.discount}%
                    </p>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
