import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { OrderDayStat } from "@/types/order.type";
import { Line, LineChart, XAxis } from "recharts";
import React, { Fragment } from "react";
import { formatDateWithRelative } from "@/utils/time";
import { ArrowDown, ArrowUp } from "lucide-react";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/format-number";

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;
export default function OrderStatsChart({
  orderDayStats,
  ordersCount,
}: {
  orderDayStats: OrderDayStat[];
  ordersCount: number;
}) {
  const sortedByDateAsc = [...orderDayStats].reverse();
  const last = sortedByDateAsc.at(-1);
  const prev = sortedByDateAsc.at(-2);

  const isUp = last && prev ? last.orders >= prev.orders : true;
  const strokeColor = isUp ? "#22c55e" : "#f97316";

  const calcGrowth = (current: number, prev: number) => {
    if (prev === 0) return 100; // tránh chia 0
    return ((current - prev) / prev) * 100;
  };

  return (
    <Fragment>
      <div className="shrink-0 flex flex-col justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center gap-4">
          <div className="border-1 border-gray-300 rounded-lg bg-white w-10 h-10 flex items-center justify-center">
            <FontAwesomeIcon
              icon={faBagShopping}
              size="xl"
              className="w-6 h-6"
            />
          </div>
          <p className="text-lg tracking-wide">Orders</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <p className="text-4xl font-medium leading-none">
              {formatNumber(ordersCount)}
            </p>
            <p className="text-base text-gray-500 leading-none mb-1">Total</p>
          </div>
          <div className="flex gap-2 items-center">
            <div
              className={cn(
                "w-6 h-6 flex items-center justify-center rounded-full",
                isUp ? "bg-[#22c55e]" : "bg-[#f97316]"
              )}
            >
              {isUp ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
            </div>
            <p className="leading-none font-medium">
              {isUp
                ? `+${calcGrowth(last?.orders || 0, prev?.orders || 0)}%`
                : `${calcGrowth(last?.orders || 0, prev?.orders || 0)}%`}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="w-full h-full flex flex-col justify-end">
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={[...orderDayStats].reverse()}
              margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            >
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                hide
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex flex-row items-center gap-4">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Date
                            </span>
                            <span className="font-bold text-foreground">
                              {formatDateWithRelative(label)}
                            </span>
                          </div>
                          <div className="flex flex-row items-center gap-4">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Orders
                            </span>
                            <span
                              className="font-bold"
                              style={{ color: strokeColor }}
                            >
                              {payload[0].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                dataKey="orders"
                type="natural"
                stroke={strokeColor}
                strokeWidth={6}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </Fragment>
  );
}
