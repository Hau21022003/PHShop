"use client";
import { orderApiRequest } from "@/api-requests/order";
import OrderView from "@/app/(user)/components/order-view";
import StatusTabs from "@/app/(user)/orders/components/status-tabs";
import { useUserContext } from "@/app/(user)/user-provider";
import { closeLoading, showLoading } from "@/components/loading-overlay";
import { handleErrorApi } from "@/lib/error";
import { defaultPageMeta, PageMetaType } from "@/schemas/common.schema";
import {
  FindAllBody,
  OrderResType,
  StatusOrders,
  SummaryResType,
} from "@/schemas/order.schema";
import { buildPaginatedMeta } from "@/utils/pagination";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<OrderResType[]>([]);
  const pageMeta = useRef<PageMetaType>(defaultPageMeta);
  const [total, setTotal] = useState(0);
  const [orderSummary, setOrderSummary] = useState<SummaryResType>();
  const searchParams = useSearchParams();
  const { scrollRef } = useUserContext();
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
      // setOrders(orders || []);
      if (findAllForm.getValues("pageNumber") === 1) setOrders(orders);
      else setOrders((prev) => [...prev, ...orders]);

      setTotal(allCount);
      setOrderSummary(summary);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      closeLoading();
      setLoading(false);
    }
  };

  useEffect(() => {
    const status = (searchParams.get("status") as StatusOrders) ?? undefined;
    findAllForm.setValue("status", status);
    findAllForm.setValue("pageNumber", 1);
    fetchOrders();
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      const el = scrollRef.current;
      if (!el || !pageMeta.current.hasNextPage || isLoading) return;

      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight - scrollTop - clientHeight < 30) {
        if (!isLoading) {
          const pageNumber = pageMeta.current.pageNumber;
          pageMeta.current = {
            ...pageMeta.current,
            pageNumber: pageNumber + 1,
          };
          findAllForm.setValue("pageNumber", pageNumber + 1);
          fetchOrders();
        }
      }
    };

    const el = scrollRef.current;

    if (el) {
      el.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading]);

  return (
    <div
      className={`container max-w-[1200px] mx-auto px-6 py-6 ${
        !loading && total === 0
          ? "h-full flex flex-col gap-10 items-center justify-center"
          : ""
      }`}
    >
      {!loading && total === 0 && (
        <Fragment>
          <p className="text-lg">You have no orders</p>
          <Link href={"/product-list"} className="w-full md:w-96">
            <p
              className="cursor-pointer uppercase text-lg font-bold tracking-wide
        bg-black text-white w-full py-4 text-center"
            >
              Continue Shopping
            </p>
          </Link>
        </Fragment>
      )}
      {total !== 0 && <StatusTabs total={total} orderSummary={orderSummary} />}
      {total !== 0 && (
        <Fragment>
          <div className="mt-4 space-y-6">
            {orders.map((order) => (
              <OrderView key={order._id} order={order} />
            ))}
          </div>
        </Fragment>
      )}
    </div>
  );
}
