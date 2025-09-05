import { DailyRevenue } from "@/types/order.type";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment } from "react";
import { formatNumber } from "@/utils/format-number";
import DailyRevenueChart from "@/app/admin/overview/components/daily-revenue-chart";

export default function DailyRevenueArea({
  dailyRevenues,
  selectedMonth,
  updateMonth,
}: {
  dailyRevenues: DailyRevenue[];
  selectedMonth: number;
  updateMonth: (month: number) => void;
}) {
  const monthRevenue = dailyRevenues.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  return (
    <Fragment>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="border-1 border-gray-300 rounded-lg bg-white w-10 h-10 flex items-center justify-center">
            <FontAwesomeIcon
              icon={faChartSimple}
              size="xl"
              className="w-6 h-6"
            />
          </div>
          <p className="text-lg tracking-wide">Sales</p>
        </div>
        <Select
          value={selectedMonth.toString()}
          onValueChange={(value) => {
            // value ở đây là string, parse ra number trước khi gửi
            const month = parseInt(value, 10);
            updateMonth(month);
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
      <DailyRevenueChart
        dailyRevenues={dailyRevenues}
        key={dailyRevenues.toString()}
      />

      <div className="flex items-start gap-2">
        <p className="leading-none text-4xl lg:text-6xl">
          {formatNumber(monthRevenue)}
        </p>
        <p className="text-gray-500 leading-none text-xl lg:text-2xl underline">
          đ
        </p>
      </div>
    </Fragment>
  );
}
