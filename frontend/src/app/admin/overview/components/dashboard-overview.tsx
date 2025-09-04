/* eslint-disable @next/next/no-img-element */
import OrderStatsChart from "@/app/admin/overview/components/order-stats-chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductResType } from "@/schemas/product.schema";
import { OrderDayStat } from "@/types/order.type";
import { formatNumber } from "@/utils/format-number";
import { faAward, faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
interface DashboardOverviewProps {
  topSaleProduct?: ProductResType;
  orderDayStats: OrderDayStat[];
  ordersCount: number;
}

export default function DashboardOverview({
  topSaleProduct,
  orderDayStats,
  ordersCount,
}: DashboardOverviewProps) {
  return (
    <div className="h-full flex flex-col gap-4 lg:flex-row lg:items-stretch overflow-hidden">
      {/* Overview dashboard */}
      <div className="flex-2 flex flex-col px-2 py-4 rounded-3xl border-2 border-gray-200 bg-gray-50 space-y-4">
        <div className="flex justify-between items-center">
          {/* <p className="ml-2 text-lg font-stretch-200% font-medium">Overview</p> */}
          <div className="flex items-center gap-4">
            <div className="border-1 border-gray-300 rounded-lg bg-white w-10 h-10 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faChartSimple}
                size="xl"
                className="w-6 h-6"
              />
            </div>
            <p className="text-lg font-stretch-200% font-medium">Sales</p>
          </div>
          <Select
            onValueChange={(value) => {
              // value ở đây là string, parse ra number trước khi gửi
              const month = parseInt(value, 10);
              // sendFilter({ month });
            }}
          >
            <SelectTrigger className="py-5 w-fit shrink-0 text-base border border-gray-300 rounded-xl">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {(() => {
                  const now = new Date();
                  const currentMonth = now.getMonth() + 1; // JS: 0-11
                  return Array.from({ length: currentMonth }).map((_, idx) => {
                    const monthNumber = idx + 1;
                    const monthName = new Date(0, idx).toLocaleString("en-US", {
                      month: "long",
                    });
                    return (
                      <SelectItem
                        key={monthNumber}
                        value={monthNumber.toString()}
                      >
                        {monthName}
                      </SelectItem>
                    );
                  });
                })()}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-4"></div>
      </div>
      {/* Top sale - order line */}
      <div className="flex-1 flex flex-col sm:flex-row md:items-stretch lg:flex-col gap-4">
        {/* order line */}
        <div className="flex-1 flex flex-row items-stretch gap-4 px-2 py-4 rounded-3xl border-2 border-gray-200 bg-gray-50">
          <OrderStatsChart
            orderDayStats={orderDayStats}
            ordersCount={ordersCount}
          />
        </div>
        {/* Top sale */}
        <div className="flex-1 flex flex-row gap-4 px-2 py-4 rounded-3xl border-2 border-gray-200 bg-gray-50 relative overflow-hidden">
          <div className="h-32 sm:h-full shrink-0 flex flex-col justify-between lg:space-y-0">
            <div className="flex items-center gap-4">
              <div className="border-1 border-gray-300 rounded-lg bg-white w-10 h-10 flex items-center justify-center">
                <FontAwesomeIcon icon={faAward} size="xl" className="w-6 h-6" />
              </div>
              <p className="text-lg tracking-wide">Orders</p>
            </div>
            <p>{formatNumber(topSaleProduct?.sold || 0)} Sold</p>
          </div>
          <div className="absolute right-7 top-3/4 -translate-y-1/3 translate-x-0 rotate-20">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <p className="truncate max-w-32 text-sm">
                {topSaleProduct?.name}
              </p>
              <p className="text-gray-500 text-sm">
                {topSaleProduct?.price.toLocaleString("vi-VN")} VND
              </p>
              <img
                src={
                  topSaleProduct?.images.length ? topSaleProduct?.images[0] : ""
                }
                alt=""
                className="mt-2 w-32 aspect-square rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
