import { searchOrderBody } from "@/schemas/order.schema";
import z from "zod";

export type CheckStockResType = {
  checkStock: boolean;
};
export type SearchOrderBodyType = z.TypeOf<typeof searchOrderBody>;