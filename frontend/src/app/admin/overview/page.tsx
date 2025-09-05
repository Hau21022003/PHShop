"use client";
import DashboardOverview from "@/app/admin/overview/components/dashboard-overview";
import MessageArea from "@/app/admin/overview/components/message-area";
import OrderArea from "@/app/admin/overview/components/order-area";
import { useConversation } from "@/app/admin/overview/hooks/use-chat";
import { useOrder } from "@/app/admin/overview/hooks/use-order";
import { useOrderStats } from "@/app/admin/overview/hooks/use-order-stats";
import { useTopSaleProduct } from "@/app/admin/overview/hooks/use-top-sale-product";
import React from "react";

export default function OverviewPage() {
  const { conversationList } = useConversation();
  const { dateFilter, orders, ordersCount, setDateFilter } = useOrder();
  const { topSaleProduct } = useTopSaleProduct();
  const { orderDayStats, dailyRevenues, selectedMonth, updateMonth } =
    useOrderStats();
  return (
    <div className="h-full overflow-y-auto lg:overflow-hidden p-4 flex flex-col items-center">
      <div className="h-full space-y-4 lg:flex lg:flex-col lg:space-y-0 gap-4 w-full max-w-screen-lg mx-auto">
        {/* Khu vực 1 */}
        <div className="flex-1 min-h-0">
          <DashboardOverview
            topSaleProduct={topSaleProduct}
            orderDayStats={orderDayStats}
            ordersCount={ordersCount}
            dailyRevenues={dailyRevenues}
            selectedMonth={selectedMonth}
            updateMonth={updateMonth}
          />
        </div>

        {/* Khu vực 2 + 3 */}
        <div className="flex-1 flex flex-col gap-4 lg:flex-row lg:items-stretch overflow-hidden">
          <div className="flex-1">
            <div className="h-full">
              <OrderArea
                dateFilter={dateFilter}
                orders={orders}
                setDateFilter={setDateFilter}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="h-full">
              <MessageArea conversationList={conversationList} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
