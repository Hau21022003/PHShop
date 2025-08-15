/* eslint-disable @next/next/no-img-element */
"use client";
import { ProductDetailType } from "@/schemas/product.schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { User } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReviewsContainerProps {
  open: boolean;
  product?: ProductDetailType;
}

enum Filter {
  NEWEST = "NEWEST",
  ONE_STAR = "ONE_STAR",
  TWO_STARS = "TWO_STARS",
  THREE_STARS = "THREE_STARS",
  FOUR_STARS = "FOUR_STARS",
  FIVE_STARS = "FIVE_STARS",
  HAS_IMAGE = "HAS_IMAGE",
}

export default function ReviewsContainer({
  open,
  product,
}: ReviewsContainerProps) {
  const [filter, setFilter] = useState<Filter>(Filter.NEWEST);
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:flex-10">
      {/* Star mobile */}
      <div className="lg:hidden"></div>
      <div className="lg:hidden space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <FontAwesomeIcon
                key={idx}
                icon={faStar}
                size="xl"
                className="w-16 h-16 text-orange-400"
              />
              // <FontAwesomeIcon
              //   key={idx}
              //   icon={faStar}
              //   size="xl"
              //   className="w-16 h-16 text-gray-300"
              // />
            ))}
          </div>
          <p className="font-medium text-2xl">4.8</p>
        </div>
        <div className="border border-gray-100"></div>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <p className="text-gray-400 w-4 leading-none text-right">3</p>
            <Progress
              value={16}
              className="h-3 flex-1 bg-gray-200 rounded-none [&>div]:bg-orange-400"
            />
            <p className="w-7 text-right leading-none truncate">254</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-400 w-4 leading-none text-right">3</p>
            <Progress
              value={16}
              className="h-3 flex-1 bg-gray-200 rounded-none [&>div]:bg-orange-400"
            />
            <p className="w-7 text-right leading-none truncate">1</p>
          </div>
        </div>
      </div>
      {/* Reviews */}
      <div className="mt-8 lg:mt-0 lg:flex-1 space-y-8">
        {/* Select filter */}
        <Select
          onValueChange={(value) => setFilter(value as Filter)}
          defaultValue={filter}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={Filter.NEWEST}>Newest</SelectItem>
              <SelectItem value={Filter.ONE_STAR}>1 star</SelectItem>
              <SelectItem value={Filter.TWO_STARS}>2 stars</SelectItem>
              <SelectItem value={Filter.THREE_STARS}>3 stars</SelectItem>
              <SelectItem value={Filter.FOUR_STARS}>4 stars</SelectItem>
              <SelectItem value={Filter.FIVE_STARS}>5 stars</SelectItem>
              <SelectItem value={Filter.HAS_IMAGE}>Has picture</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* Filter item */}
        <div className="space-y-3">
          {/* Top item */}
          <div className="flex items-start gap-3">
            <div className="rounded-full w-12 h-12 overflow-hidden">
              {/* <img src="" alt="" className="w-full h-full object-cover" /> */}
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <User className="w-7 h-7 text-gray-600" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <p className="font-medium text-sm">HAU</p>
                <p className="text-gray-400 text-sm">Yesterday</p>
              </div>
              <div className="flex gap-1">
                <FontAwesomeIcon
                  icon={faStar}
                  className="w-5 h-5 text-orange-500"
                />
                <FontAwesomeIcon
                  icon={faStar}
                  className="w-5 h-5 text-gray-300"
                />
              </div>
            </div>
          </div>
          {/* Description */}
          <div className="pl-15">
            <p>HAHA</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <img src="" alt="" className="w-24 h-24" />
              <img src="" alt="" className="w-24 h-24" />
              <img src="" alt="" className="w-24 h-24" />
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="border border-gray-100"></div>
      </div>
      {/* Star desktop */}
      <div className="hidden lg:block lg:w-72 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <FontAwesomeIcon
                key={idx}
                icon={faStar}
                size="xl"
                className="w-16 h-16 text-orange-400"
              />
              // <FontAwesomeIcon
              //   key={idx}
              //   icon={faStar}
              //   size="xl"
              //   className="w-16 h-16 text-gray-300"
              // />
            ))}
          </div>
          <p className="font-medium text-2xl">4.8</p>
        </div>
        <div className="border border-gray-100"></div>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <p className="text-gray-400 w-4 leading-none text-right">3</p>
            <Progress
              value={16}
              className="h-3 flex-1 bg-gray-200 rounded-none [&>div]:bg-orange-400"
            />
            <p className="w-7 text-right leading-none truncate">254</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-400 w-4 leading-none text-right">3</p>
            <Progress
              value={16}
              className="h-3 flex-1 bg-gray-200 rounded-none [&>div]:bg-orange-400"
            />
            <p className="w-7 text-right leading-none truncate">1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
