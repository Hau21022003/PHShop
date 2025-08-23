"use client";
import { productApiRequest } from "@/api-requests/product";
import FilterSidebar from "@/app/(user)/product-list/components/filter-sidebar";
import ProductItem from "@/app/(user)/product-list/components/product-item";
import { useUserContext } from "@/app/(user)/user-provider";
import { closeLoading, showLoading } from "@/components/loading-overlay";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { handleErrorApi } from "@/lib/error";
import { defaultPageMeta, PageMetaType } from "@/schemas/common.schema";
import {
  FindAllBody,
  Gender,
  ProductWithCategoryType,
} from "@/schemas/product.schema";
import { buildPaginatedMeta } from "@/utils/pagination";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

export default function ProductListPage() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { scrollRef } = useUserContext();
  const searchParams = useSearchParams();
  const bodyForm = useForm({
    resolver: zodResolver(FindAllBody),
    defaultValues: {
      search: "",
      filter: {
        categoryIds: [],
        price: [],
      },
    },
  });
  const { setValue } = bodyForm;
  const watchedValues = useWatch({ control: bodyForm.control });
  const [products, setProducts] = useState<ProductWithCategoryType[]>([]);
  const defaultPageMetaBase = {
    ...defaultPageMeta,
    pageSize: 9,
  };
  const pageMeta = useRef<PageMetaType>(defaultPageMetaBase);

  useEffect(() => {
    const gender = (searchParams.get("gender") as Gender) ?? undefined;
    const sale = searchParams.get("sale");
    setValue("filter.gender", gender);

    if (sale) {
      setValue("filter.sale", true);
    } else {
      setValue("filter.sale", undefined);
    }
    // const sale = searchParams.get("sale")??
  }, [searchParams]);

  const loadProducts = async () => {
    setIsLoading(true);
    showLoading();
    try {
      const findAllRsp = await productApiRequest.findAll({
        ...bodyForm.getValues(),
        pageSize: pageMeta.current.pageSize,
        pageNumber: pageMeta.current.pageNumber,
      });
      const { data, total } = findAllRsp.payload;
      if (pageMeta.current.pageNumber === 1) setProducts(data);
      else setProducts((prev) => [...prev, ...data]);
      const newPageMeta = buildPaginatedMeta(
        total,
        pageMeta.current.pageNumber,
        pageMeta.current.pageSize
      );
      pageMeta.current = newPageMeta;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      setIsLoading(false);
      closeLoading();
    }
  };
  useEffect(() => {
    pageMeta.current = defaultPageMetaBase;
    loadProducts();
  }, [watchedValues]);

  useEffect(() => {
    const handleScroll = () => {
      const el = scrollRef.current;
      if (!el || !pageMeta.current.hasNextPage || isLoading) return;

      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight - scrollTop - clientHeight < 30) {
        if (!isLoading) {
          const pageNumber = pageMeta.current.pageNumber;
          pageMeta.current = {
            ...pageMeta.current,
            pageNumber: pageNumber + 1,
          };
          loadProducts();
        }
      }
    };

    const el = scrollRef.current;

    if (el) {
      el.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading]);

  return (
    <div className="h-full container max-w-[1200px] mx-auto flex flex-col gap-2 lg:flex-row lg:gap-10 px-6 pt-6">
      <div className="h-full hidden lg:block">
        <FilterSidebar form={bodyForm} />
      </div>

      <div className="lg:hidden flex justify-between items-center">
        <p className="text-gray-500">{pageMeta.current.total} items</p>
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
      <div className="lg:flex-1">
        <div className="pb-10 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Link key={product._id} href={`/product-detail/${product._id}`}>
              <ProductItem product={product} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
