"use client";
import { productApiRequest } from "@/api-requests/product";
import FilterSidebar from "@/app/(user)/product-list/components/filter-sidebar";
import ProductItem from "@/app/(user)/product-list/components/product-item";
import { closeLoading, showLoading } from "@/components/loading-overlay";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { handleErrorApi } from "@/lib/error";
import { defaultPageMeta, PageMetaType } from "@/schemas/common.schema";
import { FindAllBody, ProductWithCategoryType } from "@/schemas/product.schema";
import { buildPaginatedMeta } from "@/utils/pagination";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function ProductListPage() {
  const [open, setOpen] = useState(false);
  const bodyForm = useForm({
    resolver: zodResolver(FindAllBody),
    defaultValues: {
      search: "",
      filter: { categoryIds: [], price: [] },
    },
  });
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState<ProductWithCategoryType[]>([]);
  const [pageMeta, setPageMeta] = useState<PageMetaType>({
    ...defaultPageMeta,
    pageSize: 12,
  });

  const loadProducts = async () => {
    try {
      const findAllRsp = await productApiRequest.findAll(bodyForm.getValues());
      const { data, total } = findAllRsp.payload;
      setProducts(data);
      const newPageMeta = buildPaginatedMeta(
        total,
        pageMeta.pageNumber,
        pageMeta.pageSize
      );
      setPageMeta(newPageMeta);

      console.log(products);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };
  useEffect(() => {
    loadProducts();
  }, [bodyForm]);

  // test
  // useEffect(() => {
  //   showLoading();
  //   setTimeout(() => {
  //     closeLoading();
  //   }, 5000);
  // }, []);
  return (
    <div className="h-full container max-w-[1200px] mx-auto flex flex-col gap-2 lg:flex-row lg:gap-10 px-4 pt-6">
      <div
        className="h-full hidden lg:block"
        // className="h-full hidden lg:block overflow-y-hidden hover:overflow-y-auto"
        // style={{ scrollbarGutter: "stable" }}
      >
        <FilterSidebar form={bodyForm} />
      </div>

      <div className="lg:hidden flex justify-between items-center">
        <p className="text-gray-500">{total} items</p>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="px-3 py-1 bg-gray-200 flex items-center gap-2 rounded-xl cursor-pointer">
              <p className="font-medium">Filter</p>
              <Settings2 className="h-4 w-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-6 h-full overflow-y-auto">
            <FilterSidebar form={bodyForm} />
          </SheetContent>
        </Sheet>
      </div>
      <div className="lg:flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
