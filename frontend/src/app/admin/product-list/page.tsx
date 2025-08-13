"use client";
/* eslint-disable @next/next/no-img-element */
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
import {
  ChevronDown,
  ChevronRight,
  Download,
  Plus,
  Search,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import ProductDetail from "@/app/admin/product-list/components/product-detail";
import { ProductWithCategoryType } from "@/schemas/product.schema";
import { handleErrorApi } from "@/lib/error";
import { productApiRequest } from "@/api-requests/product";
import { defaultPageMeta, PageMetaType } from "@/schemas/common.schema";
import { useSearchParams } from "next/navigation";
import { buildPaginatedMeta } from "@/utils/pagination";
import { closeLoading, showLoading } from "@/components/loading-overlay";

export default function ProductListPage() {
  const [products, setProducts] = useState<ProductWithCategoryType[]>([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const searchParams = useSearchParams();
  const [pageMeta, setPageMeta] = useState<PageMetaType>({
    ...defaultPageMeta,
    pageNumber: Number(searchParams.get("page") || "1"),
  });
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const loadProducts = async () => {
    showLoading();
    try {
      const findAllRsp = await productApiRequest.findAll({
        pageNumber: pageMeta.pageNumber,
        pageSize: pageMeta.pageSize,
        search: search,
      });

      const { data, total } = findAllRsp.payload;
      setProducts(data);
      const newPageMeta = buildPaginatedMeta(
        total,
        pageMeta.pageNumber,
        pageMeta.pageSize
      );
      setPageMeta(newPageMeta);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      closeLoading();
    }
  };
  useEffect(() => {
    loadProducts();
  }, [search]);

  const exportData = async () => {
    try {
      const res = await productApiRequest.export({
        pageNumber: pageMeta.pageNumber,
        pageSize: pageMeta.pageSize,
        search: search,
      });
      const blob = res.payload; // Blob file Excel
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `product_${Date.now()}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  const handleActiveChange = async (id: string, active: boolean) => {
    try {
      await productApiRequest.updateActive(id, active);
      setProducts((prev) =>
        prev.map((product) =>
          product._id === id ? { ...product, active: active } : product
        )
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  const toggleRow = (productId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(productId)) {
      newExpandedRows.delete(productId);
    } else {
      newExpandedRows.add(productId);
    }
    setExpandedRows(newExpandedRows);
  };

  const getVisiblePages = () => {
    const maxVisible = 5; // Maximum number of page buttons to show
    const pages: (number | string)[] = [];
    const { totalPages, pageNumber: currentPage } = pageMeta;

    if (totalPages <= maxVisible + 2) {
      // If total pages is small, show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage <= 3) {
      // Near the beginning
      pages.push(2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push(
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      // In the middle
      pages.push(
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }

    return pages;
  };
  const visiblePages = getVisiblePages();

  return (
    <div className="px-8 py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto space-y-4">
        {/* Header */}
        <div className="p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          {/* Left */}
          <div className="flex md:items-center gap-4 w-full">
            <div className="w-full md:w-auto flex items-center gap-2 border-2 border-gray-300 rounded-md p-2 px-4">
              <Search className="w-5 h-5 stroke-2 text-black" />
              <input
                value={search}
                onChange={(e) => {
                  setPageMeta((prev) => ({ ...prev, pageNumber: 1 }));
                  setSearch(e.target.value);
                }}
                placeholder="Search"
                className="flex-1 border-none bg-transparent focus:outline-none w-full"
              />
            </div>
            <p>
              <span>{pageMeta.total}</span>{" "}
              <span className="text-gray-400">items</span>
            </p>
          </div>
          {/* Right */}
          <div className="flex gap-2 items-stretch">
            <button
              onClick={exportData}
              className="p-3 rounded-md border-2 border-gray-300 cursor-pointer flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              <p className="whitespace-nowrap leading-0">Export</p>
            </button>
            <Link
              href="/admin/save-product"
              className="p-3 rounded-md flex items-center gap-2 text-white bg-blue-600 cursor-pointer"
            >
              <Plus className="w-5 h-5 " />
              <p className="whitespace-nowrap leading-0">New Product</p>
            </Link>
          </div>
        </div>
        {/* Table */}
        <div className="p-2 bg-gray-50 rounded-lg">
          <Table className="table-fixed sm:table-auto text-gray-500 overflow-hidden border-collapse">
            <TableHeader>
              <TableRow className="bg-gray-200 border-none">
                <TableHead
                  className="font-normal text-gray-600 tracking-wider uppercase pl-4 rounded-tl-md rounded-bl-md sm:w-auto
                  w-[74%]   /* mặc định điện thoại */
                  md:w-[40%] md:min-w-[300px] /* màn hình >= 768px */"
                >
                  Item name
                </TableHead>
                <TableHead className="font-normal text-gray-600 tracking-wider uppercase hidden sm:table-cell">
                  Price
                </TableHead>
                <TableHead className="font-normal text-gray-600 tracking-wider uppercase hidden md:table-cell">
                  Stock
                </TableHead>
                <TableHead className="font-normal text-gray-600 tracking-wider uppercase hidden lg:table-cell">
                  Rating
                </TableHead>
                <TableHead
                  className="font-normal text-gray-600 tracking-wider uppercase rounded-tr-md rounded-br-md
                  sm:w-auto w-[26%]
                  "
                  // style={{ width: "20px" }}
                ></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-base">
              {products.map((product, idx) => (
                <React.Fragment key={product._id}>
                  <TableRow
                    className={`py-4 ${
                      idx !== products.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <TableCell className="py-4 pl-4 min-w-0 max-w-0 sm:w-auto">
                      <div className="flex md:items-center items-start gap-2 text-black">
                        <img
                          src={
                            product.images.length > 0 ? product.images[0] : ""
                          }
                          alt=""
                          className="w-14 h-14 object-cover rounded-md"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate text-base">
                            {product.name}
                          </p>
                          {product.category && (
                            <p className="text-gray-500 text-sm truncate">
                              {product.category.name}
                            </p>
                          )}

                          {/* Mobile-only info */}
                          <div className="sm:hidden mt-1 space-y-1">
                            <div className="flex items-center gap-1 text-base">
                              <span className="text-black font-medium">
                                {product.price.toLocaleString("vi-VN")}đ
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{product.quantity} left</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <FontAwesomeIcon
                                  icon={faStar}
                                  size="sm"
                                  className="text-orange-500"
                                />
                                <span>4.6</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    {/* Desktop columns */}
                    <TableCell className="py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <p className="text-black">
                          {product.price.toLocaleString("vi-VN")}{" "}
                        </p>
                        <p className="font-medium text-gray-400">đ</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 hidden md:table-cell">
                      <div className="">
                        <p>
                          <span className="text-black">
                            {product.quantity} item
                          </span>{" "}
                          <span className="text-gray-400">Left</span>
                        </p>
                        <p className="text-gray-400 text-sm">
                          {product.sold} Sold
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon
                          icon={faStar}
                          className="text-orange-500 w-5 h-5"
                        />
                        <p className="text-black font-medium">4.6</p>
                        <p className="text-gray-400 ml-2">41 reviews</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 w-20">
                      <div className="flex items-center gap-4">
                        <Link href={`/admin/save-product/${product._id}`}>
                          <FontAwesomeIcon
                            icon={faPen}
                            className="text-black w-5 h-5"
                          />
                        </Link>
                        <Switch
                          title="Active"
                          checked={product.active}
                          onCheckedChange={(checked) =>
                            handleActiveChange(product._id, checked)
                          }
                        />
                        <button
                          onClick={() => toggleRow(product._id)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-300 rounded-md transition-colors"
                        >
                          {expandedRows.has(product._id) ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(product._id) && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-white rounded-md">
                        <ProductDetail product={product} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
          <div className="border-t border-gray-200"></div>
          <div className="mt-2 w-full flex justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {/* <PaginationPrevious href="#" /> */}
                  <PaginationPrevious
                    href={`?page=${pageMeta.pageNumber - 1}&search=${search}`}
                    aria-disabled={!pageMeta.hasPrevPage}
                    className={
                      !pageMeta.hasPrevPage
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
                {/* Page numbers */}
                {/* Page numbers */}
                {visiblePages.map((page, index) => (
                  <PaginationItem key={`${page}-${index}`}>
                    {page === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href={`?page=${page}&search=${search}`}
                        isActive={page === pageMeta.pageNumber}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href={`?page=${pageMeta.pageNumber + 1}&search=${search}`}
                    aria-disabled={!pageMeta.hasNextPage}
                    className={
                      !pageMeta.hasNextPage
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
