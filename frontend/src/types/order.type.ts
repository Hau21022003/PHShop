import { searchOrderBody } from "@/schemas/order.schema";
import z from "zod";

export type CheckStockResType = {
  checkStock: boolean;
};
export type SearchOrderBodyType = z.TypeOf<typeof searchOrderBody>;

export type OrderDayStat = {
  date: string;
  orders: number;
};

export type CountOrders = {
  count: number;
};

export type DailyRevenue = {
  date: string;
  amount: number;
};
