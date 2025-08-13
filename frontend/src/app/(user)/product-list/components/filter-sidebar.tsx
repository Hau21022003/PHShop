"use client";
import { categoryApiRequest } from "@/api-requests/category";
import FilterItem from "@/app/(user)/product-list/components/filter-item";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { handleErrorApi } from "@/lib/error";
import { CategoryType } from "@/schemas/category.schema";
import {
  FindAllBodyType,
  Gender,
  PriceFilter,
  SortBy,
} from "@/schemas/product.schema";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
interface FilterSidebarProps {
  form: UseFormReturn<FindAllBodyType>;
}
export default function FilterSidebar({ form }: FilterSidebarProps) {
  const [isSortByOpen, setIsSortByOpen] = React.useState(true);
  const [isPriceFilterOpen, setIsPriceFilterOpen] = React.useState(true);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = React.useState(true);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const genderOptions = [
    { Label: "UNISEX", value: Gender.UNISEX },
    { Label: "MEN", value: Gender.MALE },
    { Label: "WOMEN", value: Gender.FEMALE },
  ];
  const priceFilterOptions = [
    { label: "< 200K", value: PriceFilter.BELOW_200K },
    { label: "200K - 400K", value: PriceFilter.FROM_200K_TO_400K },
    { label: "400K - 600K", value: PriceFilter.FROM_400K_TO_600K },
    { label: "600K - 800K", value: PriceFilter.FROM_600K_TO_800K },
    { label: "> 800K", value: PriceFilter.ABOVE_800K },
  ];
  const sortByOptions = [
    { label: "Featured", value: SortBy.FEATURED },
    { label: "Newest", value: SortBy.NEWEST },
    { label: "Price: High - Low", value: SortBy.PRICE_HIGH_TO_LOW },
    { label: "Price: Low - High", value: SortBy.PRICE_LOW_TO_HIGH },
  ];

  const { watch, setValue } = form;

  const loadCategory = async () => {
    try {
      const rsp = await categoryApiRequest.findAll({
        search: "",
        status: "active",
      });
      setCategoryList(rsp.payload);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };
  useEffect(() => {
    loadCategory();
  }, []);

  return (
    <div
      // style={{ scrollbarGutter: "stable" }}
      className="w-72 pb-6 space-y-4 "
    >
      <div className="flex items-stretch gap-4">
        {genderOptions.map((gender, idx) => (
          <React.Fragment key={gender.value}>
            <p
              onClick={() => setValue("filter.gender", gender.value)}
              className={`${
                gender.value === watch("filter.gender")
                  ? "text-black"
                  : "text-gray-400"
              }  text-xl font-bold leading-none cursor-pointer`}
            >
              {gender.Label}
            </p>
            {idx !== genderOptions.length - 1 && (
              <div className="border-l border-gray-400"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="border-t-2 border-black"></div>
      {/* Category list */}
      <Collapsible
        open={isCategoryFilterOpen}
        onOpenChange={setIsCategoryFilterOpen}
        className="space-y-2"
      >
        <CollapsibleTrigger asChild>
          <div
            className={`flex items-center gap-3 ${
              !isCategoryFilterOpen ? "text-black" : "text-orange-500"
            }`}
          >
            <p className={` text-xl font-bold cursor-pointer`}>CATEGORY</p>
            {isCategoryFilterOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {categoryList.map((category) => (
            <FilterItem
              key={category._id}
              checked={watch("filter.categoryIds").includes(category._id)}
              label={category.name}
              value={category._id}
              onChange={(value) => {
                const categoryIds = watch("filter.categoryIds");
                if (categoryIds.includes(value)) {
                  const newCategoryIds = categoryIds.filter(
                    (id) => id !== value
                  );
                  setValue("filter.categoryIds", newCategoryIds);
                } else {
                  const newCategoryIds = [...categoryIds, value];
                  setValue("filter.categoryIds", newCategoryIds);
                }
              }}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>

      <div
        className="border-t-2 border-black"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, black 0, black 8px, transparent 8px, transparent 16px) 1",
        }}
      ></div>
      {/* Sort by */}
      <Collapsible
        open={isSortByOpen}
        onOpenChange={setIsSortByOpen}
        className="space-y-2"
      >
        <CollapsibleTrigger asChild>
          <div
            className={`flex items-center gap-3 ${
              !isSortByOpen ? "text-black" : "text-orange-500"
            }`}
          >
            <p className={` text-xl font-bold cursor-pointer`}>SORT BY</p>
            {isSortByOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {sortByOptions.map((sortByItem) => (
            <FilterItem
              key={sortByItem.value}
              label={sortByItem.label}
              value={sortByItem.value}
              checked={watch("filter.sortBy") === sortByItem.value}
              onChange={(value) => {
                const currentSortBy = watch("filter.sortBy");
                if (currentSortBy === value)
                  setValue("filter.sortBy", undefined);
                else setValue("filter.sortBy", value);
              }}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
      <div
        className="border-t-2 border-black"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, black 0, black 8px, transparent 8px, transparent 16px) 1",
        }}
      ></div>
      {/* Price */}
      <Collapsible
        open={isPriceFilterOpen}
        onOpenChange={setIsPriceFilterOpen}
        className="space-y-2"
      >
        <CollapsibleTrigger asChild>
          <div
            className={`flex items-center gap-3 ${
              !isPriceFilterOpen ? "text-black" : "text-orange-500"
            }`}
          >
            <p className={` text-xl font-bold cursor-pointer`}>PRICE</p>
            {isPriceFilterOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {priceFilterOptions.map((pricesFilterItem) => (
            <FilterItem
              key={pricesFilterItem.value}
              label={pricesFilterItem.label}
              value={pricesFilterItem.value}
              checked={watch("filter.price").includes(pricesFilterItem.value)}
              onChange={(value) => {
                const currentPrices = watch("filter.price");
                if (currentPrices.includes(value)) {
                  const newPriceFilter = currentPrices.filter(
                    (item) => item !== value
                  );
                  setValue("filter.price", newPriceFilter);
                } else {
                  const newPriceFilter = [...currentPrices, value];
                  setValue("filter.price", newPriceFilter);
                }
              }}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
