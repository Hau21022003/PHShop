import { orderApiRequest } from "@/api-requests/order";
import { handleErrorApi } from "@/lib/error";
import { OrderDayStat } from "@/types/order.type";
import { useEffect, useState } from "react";

export function useOrderStats() {
  const [orderDayStats, setOrderDayStats] = useState<OrderDayStat[]>([]);
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
  return { orderDayStats };
}
