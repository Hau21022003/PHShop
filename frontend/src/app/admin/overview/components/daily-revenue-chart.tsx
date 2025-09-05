"use client";
import { DailyRevenue } from "@/types/order.type";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Bar, BarChart, LabelList, XAxis } from "recharts";
import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateWithRelative } from "@/utils/time";
import { formatNumber } from "@/utils/format-number";
import { useMediaQuery } from "@/app/admin/overview/hooks/use-media-query";

const chartConfig = {
  desktop: {
    label: "Amount",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function DailyRevenueChart({
  dailyRevenues,
}: {
  dailyRevenues: DailyRevenue[];
}) {
  const strokeColor = "#f97316";
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll đến cuối khi load lần đầu
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [dailyRevenues]);

  const handleScroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const isMobile = useMediaQuery("(max-width: 768px)"); // breakpoint tuỳ bạn
  const columnWidth = isMobile ? 60 : 100;
  return (
    <div className="relative group h-30 lg:min-h-0 lg:flex-1 w-full">
      <div
        ref={scrollRef}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="w-full h-full overflow-x-auto scrollbar-hide"
      >
        <ChartContainer
          config={chartConfig}
          className="h-full"
          style={{
            width: `${dailyRevenues.length * columnWidth}px`,
          }}
        >
          <BarChart data={dailyRevenues.reverse()}>
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
                            Amount
                          </span>
                          <div className="flex flex-row items-center gap-1">
                            <span
                              className="font-bold"
                              style={{ color: strokeColor }}
                            >
                              {payload[0].value?.toLocaleString("vi-VN")}
                            </span>
                            <span>VND</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="amount" fill={strokeColor} radius={8}>
              <LabelList
                dataKey="amount"
                content={(props) => {
                  const { value, x, y, width, height } = props;

                  const h = Number(height); // ép về number

                  if (!h || h < 30) return null;

                  return (
                    <text
                      x={Number(x) + Number(width) / 2}
                      y={isMobile ? Number(y) + 14 : Number(y) + 20}
                      textAnchor="middle"
                      fill="black"
                      fontSize={isMobile ? 10 : 14}
                    >
                      {formatNumber(value as number)}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
      <button
        onClick={() => handleScroll("left")}
        className="absolute top-1/2 -translate-y-1/2 left-2 bg-white shadow rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleScroll("right")}
        className="absolute top-1/2 -translate-y-1/2 right-2 bg-white shadow rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
