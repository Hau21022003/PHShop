"use client";
import { orderApiRequest } from "@/api-requests/order";
import OrderView from "@/app/(user)/components/order-view";
import SearchContainer from "@/app/(user)/search-order/components/search-container";
import SearchContainer2 from "@/app/(user)/search-order/components/search-container-2";
import { closeLoading, showLoading } from "@/components/loading-overlay";
import { handleErrorApi } from "@/lib/error";
import { OrderResType, searchOrderBody } from "@/schemas/order.schema";
import { useAppStore } from "@/stores/app-store";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function SearchOrderPage() {
  const [order, setOrder] = useState<OrderResType>();
  const searchOrderForm = useForm({
    resolver: zodResolver(searchOrderBody),
    defaultValues: {},
  });
  const { user } = useAppStore();
  const fetchOrder = async () => {
    try {
      showLoading();
      const order = (
        await orderApiRequest.searchOrder(searchOrderForm.getValues())
      ).payload;
      setOrder(order);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      closeLoading();
    }
  };

  return (
    <div
      className={`container max-w-[1200px] mx-auto px-6 py-6 ${
        !order ? "h-full flex flex-col gap-10 items-center justify-center" : ""
      }`}
    >
      {/* Search container while order = undefined */}
      {!order && (
        <div className="w-full max-w-lg">
          <SearchContainer
            searchOrderForm={searchOrderForm}
            fetchOrder={fetchOrder}
          />
        </div>
      )}
      {order && (
        <div className="w-full space-y-4">
          <SearchContainer2
            searchOrderForm={searchOrderForm}
            fetchOrder={fetchOrder}
          />
          <OrderView fetchOrder={fetchOrder} user={user} order={order} />
        </div>
      )}
    </div>
  );
}
