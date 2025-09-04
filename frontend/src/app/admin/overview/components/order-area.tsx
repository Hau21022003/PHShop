import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DateFilter, OrderResType, StatusOrders } from "@/schemas/order.schema";
import { Check, Clock, Settings, Truck, X } from "lucide-react";
import React, { Fragment, JSX } from "react";
interface OrderAreaProps {
  orders: OrderResType[];
  dateFilter: DateFilter;
  setDateFilter: (dateFilter: DateFilter) => void;
}
export default function OrderArea({
  orders,
  dateFilter,
  setDateFilter,
}: OrderAreaProps) {
  const statusOrderElements: Record<StatusOrders, JSX.Element> = {
    [StatusOrders.PENDING]: (
      <div
        className={cn(
          "px-3 py-2 w-fit rounded-sm flex items-center gap-1",
          "text-yellow-600 font-medium text-sm bg-yellow-100"
        )}
      >
        <Clock className="w-5 h-5" />
        <p className="leading-none">Pending</p>
      </div>
    ),
    [StatusOrders.SHIPPED]: (
      <div
        className={cn(
          "px-3 py-2 w-fit rounded-sm flex items-center gap-1",
          "text-indigo-600 font-medium text-sm bg-indigo-100"
        )}
      >
        <Truck className="w-5 h-5" />
        <p className="leading-none">Shipped</p>
      </div>
    ),
    [StatusOrders.PROCESSING]: (
      <div
        className={cn(
          "px-3 py-2 w-fit rounded-sm flex items-center gap-1",
          "text-blue-600 font-medium text-sm bg-blue-100"
        )}
      >
        <Settings className="w-5 h-5" />
        <p className="leading-none">Processing</p>
      </div>
    ),
    [StatusOrders.CANCEL]: (
      <div
        className={cn(
          "px-3 py-2 w-fit rounded-sm flex items-center gap-1",
          "text-red-600 font-medium text-sm bg-red-100"
        )}
      >
        <X className="w-5 h-5" />
        <p className="leading-none">Cancel</p>
      </div>
    ),
    [StatusOrders.DELIVERED]: (
      <div
        className={cn(
          "px-3 py-2 w-fit rounded-sm flex items-center gap-1",
          "text-green-600 font-medium text-sm bg-green-100"
        )}
      >
        <Check className="w-5 h-5" />
        <p className="leading-none">Delivered</p>
      </div>
    ),
  };

  return (
    <div className="flex flex-col h-full px-2 py-4 rounded-3xl border-2 border-gray-200 bg-gray-50 space-y-4">
      <div className="flex justify-between items-center h-11">
        <p className="ml-2 text-lg font-stretch-200% font-medium">Orders</p>
        <Select
          onValueChange={(value) => {
            setDateFilter(value as DateFilter);
          }}
          value={dateFilter}
        >
          <SelectTrigger className="w-fit shrink-0 text-base border border-gray-300 rounded-xl">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(DateFilter).map(([key, label]) => (
                <SelectItem key={key} value={label}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div
        className="flex-1 overflow-y-auto space-y-2"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Table className="border-collapse">
          <TableBody className="text-base">
            {orders.map((order) => (
              <Fragment key={order._id}>
                <TableRow
                  key={order._id}
                  className={`rounded-lg overflow-hidden bg-white py-4  border-none`}
                >
                  <TableCell className="rounded-tl-lg rounded-bl-lg py-4 text-black font-medium">
                    {order.code}
                  </TableCell>
                  <TableCell className="py-4 flex justify-end">
                    {statusOrderElements[order.status]}
                  </TableCell>
                  <TableCell className="rounded-tr-lg rounded-br-lg py-4">
                    {order.totalAmount.toLocaleString("vi-VN")} VND
                  </TableCell>
                </TableRow>
                <div className="pb-2"></div>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
