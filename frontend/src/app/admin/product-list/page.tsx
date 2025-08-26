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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  ChevronUp,
  Download,
  EllipsisVertical,
  Plus,
  Search,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import ProductDetail from "@/app/admin/product-list/components/product-detail";
import { FindAllBody, ProductWithCategoryType } from "@/schemas/product.schema";
import { handleErrorApi } from "@/lib/error";
import { productApiRequest } from "@/api-requests/product";
import { defaultPageMeta, PageMetaType } from "@/schemas/common.schema";
import { useSearchParams } from "next/navigation";
import { buildPaginatedMeta, getVisiblePages } from "@/utils/pagination";
import { closeLoading, showLoading } from "@/components/loading-overlay";
import { downloadFile } from "@/utils/download-file";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryType } from "@/schemas/category.schema";
import { categoryApiRequest } from "@/api-requests/category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductListPage() {
  const [products, setProducts] = useState<ProductWithCategoryType[]>([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const searchParams = useSearchParams();
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [pageMeta, setPageMeta] = useState<PageMetaType>({
    ...defaultPageMeta,
    pageNumber: Number(searchParams.get("page") || "1"),
  });
  const [visiblePages, setVisiblePages] = useState<(string | number)[]>([]);
  // const visiblePages = getVisiblePages(pageMeta);
  const findAllForm = useForm({
    resolver: zodResolver(FindAllBody),
    defaultValues: {
      filter: { categoryIds: [] },
    },
  });

  const fetchCategory = async () => {
    try {
      const categoryList = (await categoryApiRequest.findAll()).payload;
      setCategoryList(categoryList);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  const fetchProducts = async () => {
    showLoading();
    try {
      const findAllRsp = await productApiRequest.findAll(
        findAllForm.getValues()
      );

      const { data, total } = findAllRsp.payload;
      setProducts(data);
      const newPageMeta = buildPaginatedMeta(
        total,
        findAllForm.getValues("pageNumber") || 1,
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
    findAllForm.setValue("search", searchParams.get("search") || "");
    const pageNumber = Number(searchParams.get("page") || "1");
    const filterCategoryId = searchParams.get("categoryId");
    if (filterCategoryId)
      findAllForm.setValue("filter.categoryIds", [filterCategoryId]);
    const search = searchParams.get("search") || "";
    findAllForm.setValue("search", search);

    setPageMeta((prev) => ({ ...prev, pageNumber: pageNumber }));
    findAllForm.setValue("pageNumber", pageNumber);
    fetchProducts();
    fetchCategory();
  }, [searchParams]);

  useEffect(() => {
    const pageNumber = findAllForm.watch("pageNumber") || 1;
    setPageMeta((prev) => ({ ...prev, pageNumber: pageNumber }));
  }, [findAllForm.watch("pageNumber")]);

  useEffect(() => {
    console.log(pageMeta);
    const visiblePages = getVisiblePages(
      pageMeta.totalPages,
      pageMeta.pageNumber,
      5
    );
    console.log("visiblePages", visiblePages);
    setVisiblePages(visiblePages);
  }, [pageMeta]);

  const exportData = async () => {
    try {
      // const res = await productApiRequest.export({
      //   pageNumber: pageMeta.pageNumber,
      //   pageSize: pageMeta.pageSize,
      //   search,
      // });
      const res = await productApiRequest.export(findAllForm.getValues());

      downloadFile(res.payload, `product_${Date.now()}.xlsx`);
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

  const getBaseParams = () => {
    const params = new URLSearchParams();
    const { search, filter } = findAllForm.getValues();
    if (search) params.set("search", search);
    if (filter?.categoryIds.length !== 0)
      params.set("categoryId", filter?.categoryIds[0] || "");
    return params.toString() ? `${params.toString()}` : "";
  };

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
                value={findAllForm.watch("search")}
                onChange={(e) => {
                  findAllForm.setValue("search", e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    findAllForm.setValue("pageNumber", 1);
                    fetchProducts();
                  }
                }}
                placeholder="Search"
                className="flex-1 border-none bg-transparent focus:outline-none w-full"
              />
            </div>
            <p className="hidden sm:block">
              <span>{pageMeta.total}</span>{" "}
              <span className="text-gray-400">items</span>
            </p>
            <Link
              href="/admin/save-product"
              className="sm:hidden p-3 rounded-md flex items-center gap-2 text-white bg-blue-600 cursor-pointer"
            >
              <Plus className="w-5 h-5 " />
              <p className="whitespace-nowrap leading-0">
                New <span className="hidden sm:block">Product</span>
              </p>
            </Link>
          </div>
          {/* Right */}
          <div className="flex gap-2 items-stretch">
            <Select
              value={
                findAllForm.watch("filter.categoryIds").length !== 0
                  ? findAllForm.watch("filter.categoryIds")[0]
                  : undefined
              }
              onValueChange={(value) => {
                if (value === "All") {
                  findAllForm.setValue("filter.categoryIds", []);
                } else {
                  findAllForm.setValue("filter.categoryIds", [value]);
                }
                findAllForm.setValue("pageNumber", 1);
                fetchProducts();
              }}
            >
              <SelectTrigger className="w-[150px] border-gray-300 border-2 text-base py-5">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {categoryList.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={exportData}
              className="p-2 rounded-md border-2 border-gray-300 cursor-pointer flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              <p className="whitespace-nowrap leading-0">Export</p>
            </button>
            <Link
              href="/admin/save-product"
              className="hidden sm:flex p-2 rounded-md items-center gap-2 text-white bg-blue-600 cursor-pointer"
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
                  w-[100%] rounded-tr-md rounded-br-md
                  sm:rounded-tr-none sm:rounded-br-none
                  md:w-[40%] md:min-w-[300px]
                  "
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
                  sm:w-auto w-[26%] hidden sm:table-cell
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
                        {/* <DropdownMenu>
                          <DropdownMenuTrigger className="sm:hidden">
                            <EllipsisVertical className="w-5 h-5 cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Switch
                                title="Active"
                                checked={product.active}
                                onCheckedChange={(checked) =>
                                  handleActiveChange(product._id, checked)
                                }
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/admin/save-product/${product._id}`}>
                                <FontAwesomeIcon
                                  icon={faPen}
                                  className="text-black w-5 h-5"
                                />
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu> */}
                        <Popover>
                          <PopoverTrigger className="sm:hidden">
                            <EllipsisVertical className="w-5 h-5 cursor-pointer" />
                          </PopoverTrigger>
                          <PopoverContent className="w-36">
                            <div className="flex flex-col gap-2">
                              <Link
                                className="flex"
                                href={`/admin/save-product/${product._id}`}
                              >
                                <p className="w-20 text-left">Edit</p>
                                <FontAwesomeIcon
                                  icon={faPen}
                                  className="text-black w-5 h-5"
                                />{" "}
                              </Link>
                              <div className="flex items-center">
                                <p className="w-20 text-left">Active</p>
                                <Switch
                                  title="Active"
                                  checked={product.active}
                                  onCheckedChange={(checked) =>
                                    handleActiveChange(product._id, checked)
                                  }
                                />
                              </div>
                              <button
                                onClick={() => toggleRow(product._id)}
                                className="flex cursor-pointer pr-2 text-gray-600"
                              >
                                <p className="w-20 text-left">Expand</p>
                                {expandedRows.has(product._id) ? (
                                  <ChevronDown className="w-5 h-5" />
                                ) : (
                                  <ChevronUp className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
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
                    <TableCell className="py-4 w-20 hidden sm:table-cell">
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
                          className="cursor-pointer pr-2 text-gray-600"
                        >
                          {expandedRows.has(product._id) ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronUp className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(product._id) && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-white rounded-md">
                        <ProductDetail
                          product={product}
                          loadProducts={fetchProducts}
                        />
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
                  <PaginationPrevious
                    href={`?${getBaseParams()}&page=${pageMeta.pageNumber - 1}`}
                    aria-disabled={!pageMeta.hasPrevPage}
                    className={
                      !pageMeta.hasPrevPage
                        ? "pointer-events-none opacity-50"
                        : ""
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
                        href={`?${getBaseParams()}&page=${page}`}
                        isActive={page === pageMeta.pageNumber}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href={`?${getBaseParams()}&page=${pageMeta.pageNumber + 1}`}
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
