import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { StatusOrders, SummaryResType } from "@/schemas/order.schema";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
interface StatusTabsProps {
  orderSummary?: SummaryResType;
  total: number;
}
export default function StatusTabs({ orderSummary, total }: StatusTabsProps) {
  const searchParams = useSearchParams();
  const statusOptions = [
    {
      label: "All",
      value: "",
      active: !searchParams.get("status"),
      count: total,
    },
    {
      label: "Pending",
      value: StatusOrders.PENDING,
      active: searchParams.get("status") === StatusOrders.PENDING,
      count: orderSummary ? orderSummary[StatusOrders.PENDING] : 0,
    },
    {
      label: "Processing",
      value: StatusOrders.PROCESSING,
      active: searchParams.get("status") === StatusOrders.PROCESSING,
      count: orderSummary ? orderSummary[StatusOrders.PROCESSING] : 0,
    },
    {
      label: "Shipped",
      value: StatusOrders.SHIPPED,
      active: searchParams.get("status") === StatusOrders.SHIPPED,
      count: orderSummary ? orderSummary[StatusOrders.SHIPPED] : 0,
    },
    {
      label: "Delivered",
      value: StatusOrders.DELIVERED,
      active: searchParams.get("status") === StatusOrders.DELIVERED,
      count: orderSummary ? orderSummary[StatusOrders.DELIVERED] : 0,
    },
    {
      label: "Cancel",
      value: StatusOrders.CANCEL,
      active: searchParams.get("status") === StatusOrders.CANCEL,
      count: orderSummary ? orderSummary[StatusOrders.CANCEL] : 0,
    },
  ];
  return (
    <div>
      <div
        className={cn(
          "hidden w-fit lg:flex lg:items-center lg:gap-2",
          "bg-gray-200 p-[3px] rounded-sm"
        )}
      >
        {statusOptions.map((optional, i) => (
          <Link
            key={i}
            href={
              optional.value
                ? `/orders?status=${optional.value}`
                : `/orders`
            }
          >
            <p
              className={cn(
                "py-[6px] px-4 rounded-sm",
                optional.active ? "text-orange-600 bg-white" : ""
              )}
            >
              {optional.label} {optional.count ? `(${optional.count})` : ""}
            </p>
          </Link>
        ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <div
            className={cn(
              "h-full py-2 px-4 flex items-center gap-2 border-gray-400 border-1 rounded-md",
              "lg:hidden"
            )}
          >
            <p>Order status</p>
            <ChevronDown className="w-4 h-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          {statusOptions.map((optional, i) => (
            <DropdownMenuItem
              key={i}
              className={`${optional.active ? "bg-gray-100" : ""}`}
            >
              <Link
                className="w-full"
                key={i}
                href={
                  optional.value !== ""
                    ? `/orders?status=${optional.value}`
                    : `/orders`
                }
              >
                {optional.label} {optional.count ? `(${optional.count})` : ""}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
