"use client";
import { orderApiRequest } from "@/api-requests/order";
import StatusTabs from "@/app/admin/orders/components/status-tabs";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import {
  DateFilter,
  FindAllBody,
  OrderResType,
  StatusOrders,
  SummaryResType,
} from "@/schemas/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ResponsiveOrderDetails from "@/app/admin/orders/components/responsive-order-details";
import OrdersTable from "@/app/admin/orders/components/orders-table";
import { closeLoading, showLoading } from "@/components/loading-overlay";
import { useSearchParams } from "next/navigation";
import { defaultPageMeta, PageMetaType } from "@/schemas/common.schema";
import { buildPaginatedMeta } from "@/utils/pagination";

export default function OrdersPage() {
  const [orderSummary, setOrderSummary] = useState<SummaryResType>();
  const [orders, setOrders] = useState<OrderResType[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<
    OrderResType | undefined
  >();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const searchParams = useSearchParams();
  const pageMeta = useRef<PageMetaType>(defaultPageMeta);
  const findAllForm = useForm({
    resolver: zodResolver(FindAllBody),
    defaultValues: {},
  });

  const fetchOrders = async () => {
    try {
      showLoading();
      const rsp = (await orderApiRequest.findAll(findAllForm.getValues()))
        .payload;
      const { items: orders, total, summary } = rsp;

      const newPageMeta = buildPaginatedMeta(
        total,
        pageMeta.current.pageNumber,
        pageMeta.current.pageSize
      );
      const allCount = Object.entries(StatusOrders).reduce(
        (sum, [, label]) => (summary[label] ? sum + summary[label] : sum),
        0
      );

      pageMeta.current = newPageMeta;
      setOrders(orders || []);
      setTotal(allCount);
      setOrderSummary(summary);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    const status = (searchParams.get("status") as StatusOrders) ?? undefined;
    findAllForm.setValue("status", status);

    const dateFilter =
      (searchParams.get("dateFilter") as DateFilter) ?? undefined;
    findAllForm.setValue("dateFilter", dateFilter);

    const search = searchParams.get("search") ?? "";
    findAllForm.setValue("search", search);

    const pageNumber = Number(searchParams.get("page") || "1");
    findAllForm.setValue("pageNumber", pageNumber);
    fetchOrders();
  }, [searchParams]);

  useEffect(() => {
    const pageNumber = findAllForm.watch("pageNumber") || 1;
    pageMeta.current = {
      ...pageMeta.current,
      pageNumber: pageNumber,
    };
  }, [findAllForm.watch("pageNumber")]);

  const handleCloseOrderDetails = () => {
    setIsDetailsOpen(false);
  };

  const handleOpenOrderDetails = (order: OrderResType) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <div className="px-4 py-8 flex flex-col items-center">
      <div className="w-full flex items-start gap-6">
        <div className={cn("w-full mx-auto space-y-4", "max-w-screen-lg")}>
          <StatusTabs
            findAllForm={findAllForm}
            fetchOrders={fetchOrders}
            orderSummary={orderSummary}
            total={total}
          />
          <OrdersTable
            findAllForm={findAllForm}
            pageMeta={pageMeta.current}
            loadOrders={fetchOrders}
            orders={orders}
            handleOpenOrderDetails={handleOpenOrderDetails}
          />
        </div>
        <ResponsiveOrderDetails
          onClose={handleCloseOrderDetails}
          order={selectedOrder}
          open={
            isDetailsOpen &&
            orders.some((order) => order._id === selectedOrder?._id)
          }
          loadOrders={fetchOrders}
        />
      </div>
    </div>
  );
}
