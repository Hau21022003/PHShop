import { orderApiRequest } from "@/api-requests/order";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import {
  DateFilter,
  FindAllBodyType,
  StatusOrders,
  SummaryResType,
} from "@/schemas/order.schema";
import { downloadFile } from "@/utils/download-file";
import { ChevronDown, Download, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface StatusTabsProps {
  orderSummary?: SummaryResType;
  total: number;
  findAllForm: UseFormReturn<FindAllBodyType>;
  fetchOrders: () => void;
}
export default function StatusTabs({
  orderSummary,
  total,
  findAllForm,
  fetchOrders,
}: StatusTabsProps) {
  const searchParams = useSearchParams();
  const getBaseParams = (findAllForm: UseFormReturn<FindAllBodyType>) => {
    const params = new URLSearchParams();
    const { search, dateFilter } = findAllForm.getValues();
    if (search) params.set("search", search);
    if (dateFilter) params.set("dateFilter", dateFilter);
    return params.toString() ? `${params.toString()}` : "";
  };

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

  const exportOrders = async () => {
    try {
      const rsp = await orderApiRequest.export(findAllForm.getValues());
      downloadFile(rsp.payload, `order_${Date.now()}.xlsx`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 overflow-hidden rounded-sm p-4">
        <div className={cn("flex items-stretch gap-2 justify-between")}>
          <div
            className={cn(
              "hidden lg:flex lg:items-center lg:gap-2",
              "bg-gray-200 p-[3px] rounded-sm"
            )}
          >
            {statusOptions.map((optional, i) => (
              <Link
                key={i}
                href={
                  optional.value
                    ? `/admin/orders?${getBaseParams(findAllForm)}&status=${
                        optional.value
                      }`
                    : `/admin/orders?${getBaseParams(findAllForm)}`
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
            <DropdownMenuTrigger>
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
                        ? `/admin/orders?status=${optional.value}`
                        : `/admin/orders`
                    }
                  >
                    {optional.label}{" "}
                    {optional.count ? `(${optional.count})` : ""}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            onClick={exportOrders}
            className="cursor-pointer sm:hidden rounded-sm bg-black text-white px-4 py-2 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            <p className="leading-none">Export as CSV</p>
          </button>
        </div>
      </div>
      <div className="flex justify-between items-stretch flex-wrap gap-4">
        <button
          onClick={exportOrders}
          className="cursor-pointer hidden rounded-sm bg-black text-white px-4 py-2 sm:flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          <p className="leading-none">Export as CSV</p>
        </button>
        <div className="flex-1 sm:flex-none h-full flex gap-2">
          <Select
            onValueChange={(value) => {
              findAllForm?.setValue("dateFilter", value as DateFilter);
              findAllForm.setValue("pageNumber", 1);
              fetchOrders();
            }}
            value={findAllForm?.watch("dateFilter")}
          >
            <SelectTrigger className="w-[150px] shrink-0 text-base py-5">
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
          <div className="flex-1 px-2 flex items-center gap-2 rounded-sm border-2 border-gray-200">
            <Search className="w-5 h-5 shrink-0" />
            <input
              type="text"
              className="flex-1 outline-none"
              placeholder="Search"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  findAllForm.setValue("pageNumber", 1);
                  fetchOrders();
                }
              }}
              onChange={(e) => findAllForm.setValue("search", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
