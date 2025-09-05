import { orderApiRequest } from "@/api-requests/order";
import { handleErrorApi } from "@/lib/error";
import { DailyRevenue, OrderDayStat } from "@/types/order.type";
import { useCallback, useEffect, useState } from "react";

export function useOrderStats() {
  const [orderDayStats, setOrderDayStats] = useState<OrderDayStat[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [dailyRevenues, setDailyRevenues] = useState<DailyRevenue[]>([]);
  const updateMonth = useCallback((month: number) => {
    if (month < 1 || month > 12) {
      throw new Error("Month invalid");
    }
    setSelectedMonth(month);
  }, []);

  useEffect(() => {
    const fetchRecentOrderDays = async () => {
      try {
        const orderDayStats = (await orderApiRequest.getRecentOrderDays())
          .payload;
        setOrderDayStats(orderDayStats);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    };
    fetchRecentOrderDays();
  }, []);
  useEffect(() => {
    const fetchDailyRevenues = async () => {
      try {
        const dailyRevenueList = (
          await orderApiRequest.getDailyRevenue(selectedMonth)
        ).payload;
        setDailyRevenues(dailyRevenueList);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    };
    fetchDailyRevenues();
  }, [selectedMonth]);
  return { orderDayStats, selectedMonth, dailyRevenues, updateMonth };
}
