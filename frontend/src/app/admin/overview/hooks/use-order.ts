import { orderApiRequest } from "@/api-requests/order";
import { handleErrorApi } from "@/lib/error";
import { DateFilter, OrderResType } from "@/schemas/order.schema";
import { useCallback, useEffect, useState } from "react";

export function useOrder() {
  const [orders, setOrders] = useState<OrderResType[]>([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [dateFilter, setDateFilterState] = useState<DateFilter>(
    DateFilter.ALL_TIME
  );
  const setDateFilter = useCallback(
    (dateFilter: DateFilter) => {
      setDateFilterState(dateFilter);
    },
    [setDateFilterState]
  );
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { items } = (
          await orderApiRequest.findAll({
            dateFilter: dateFilter,
          })
        ).payload;
        setOrders(items);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    };
    fetchOrders();
  }, [dateFilter]);

  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        const ordersCount = (await orderApiRequest.countOrders()).payload;
        setOrdersCount(ordersCount.count);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    };
    fetchOrdersCount();
  }, []);

  return { orders, dateFilter, ordersCount, setDateFilter };
}
