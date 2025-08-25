import {
  FindAllBodyType,
  OrderResType,
  StatusOrders,
} from "@/schemas/order.schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React, { JSX } from "react";
import {
  Check,
  Clock,
  FileSpreadsheet,
  PencilLine,
  Settings,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { formatDateWithRelative } from "@/utils/time";
import { cn } from "@/lib/utils";
import { handleErrorApi } from "@/lib/error";
import { orderApiRequest } from "@/api-requests/order";
import { PageMetaType } from "@/schemas/common.schema";
import { getVisiblePages } from "@/utils/pagination";
import { UseFormReturn } from "react-hook-form";

interface OrdersTableProps {
  orders: OrderResType[];
  handleOpenOrderDetails: (order: OrderResType) => void;
  loadOrders: () => void;
  pageMeta: PageMetaType;
  findAllForm: UseFormReturn<FindAllBodyType>;
}

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

export default function OrdersTable({
  handleOpenOrderDetails,
  orders,
  loadOrders,
  pageMeta,
  findAllForm,
}: OrdersTableProps) {
  const removeOrder = async (orderId: string) => {
    try {
      await orderApiRequest.remove(orderId);
      loadOrders();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };
  const visiblePages = getVisiblePages(
    pageMeta.totalPages,
    pageMeta.pageNumber,
    5
  );

  const getBaseParams = (findAllForm: UseFormReturn<FindAllBodyType>) => {
    const params = new URLSearchParams();
    const { search, dateFilter } = findAllForm.getValues();

    if (search) params.set("search", search);
    if (dateFilter) params.set("dateFilter", dateFilter);

    return params.toString() ? `${params.toString()}` : "";
  };
  return (
    <div className="">
      <Table className="text-gray-600 overflow-hidden border-collapse">
        <TableHeader>
          <TableRow className="bg-gray-100 border-none">
            <TableHead className="tracking-wider uppercase pl-4 rounded-tl-sm rounded-bl-sm">
              Category
            </TableHead>
            <TableHead className="tracking-wider uppercase hidden sm:table-cell">
              Created day
            </TableHead>
            <TableHead className="tracking-wider text-right uppercase hidden md:table-cell">
              Amount
            </TableHead>
            <TableHead className="tracking-wider uppercase">Status</TableHead>
            <TableHead className="tracking-wider uppercase pr-4 rounded-tr-sm rounded-br-sm text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base">
          {orders.map((order) => {
            return (
              <TableRow
                key={order._id}
                className={`py-4 border-b border-gray-200`}
              >
                <TableCell className="py-4 pl-4 text-black">
                  <div className="flex items-start gap-2 sm:items-center">
                    <FileSpreadsheet className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="truncate font-medium sm:leading-none">
                        {order.code}
                      </p>
                      <div className="space-y-1 sm:hidden mt-1">
                        <p className="text-sm text-gray-500">
                          Amount: {order.totalAmount}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          Created date:{" "}
                          {formatDateWithRelative(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 hidden sm:table-cell text-gray-500">
                  {formatDateWithRelative(order.createdAt)}
                </TableCell>
                <TableCell className="py-4 text-right hidden md:table-cell text-gray-500">
                  {order.totalAmount.toLocaleString("vi-VN")} VND
                </TableCell>
                <TableCell className="py-4">
                  {statusOrderElements[order.status]}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => removeOrder(order._id)}
                      className="p-1 cursor-pointer hover:bg-red-100 rounded text-red-600"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleOpenOrderDetails(order)}
                      className="p-1 cursor-pointer hover:bg-gray-300 rounded text-black"
                    >
                      <PencilLine className="w-6 h-6" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="border-t border-gray-200"></div>
      <div className="mt-2 w-full flex justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?${getBaseParams(findAllForm)}&page=${
                  pageMeta.pageNumber - 1
                }`}
                aria-disabled={!pageMeta.hasPrevPage}
                className={
                  !pageMeta.hasPrevPage ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {/* Page numbers */}
            {visiblePages.map((page, index) => (
              <PaginationItem key={`${page}-${index}`}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={`?${getBaseParams(findAllForm)}&page=${page}`}
                    isActive={page === pageMeta.pageNumber}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={`?${getBaseParams(findAllForm)}&page=${
                  pageMeta.pageNumber + 1
                }`}
                aria-disabled={!pageMeta.hasNextPage}
                className={
                  !pageMeta.hasNextPage ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
