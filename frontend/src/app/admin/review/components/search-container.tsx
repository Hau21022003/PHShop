"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateFilter } from "@/enums/review.enum";
import { cn } from "@/lib/utils";
import { FindAllBody } from "@/types/review.type";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function SearchContainer() {
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const getBaseParams = (...excludes: (keyof FindAllBody)[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (excludes) {
      excludes.forEach((exclude) => params.delete(exclude));
    }

    params.delete("pageNumber");

    return params.toString();
  };
  return (
    <div className="flex items-start flex-col md:flex-row md:items-center gap-4">
      <p className="text-gray-500 shrink-0">Search</p>
      <div className="p-1 px-2 border border-gray-400 2xl:max-w-2xl w-full">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              redirect(
                `/admin/review?${getBaseParams("search")}&${
                  search ? `search=${search}` : ""
                }`
              );
            }
          }}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="bg-white outline-none w-full"
          placeholder="Enter product name, reviewer name"
        />
      </div>
      <div className="flex gap-4 items-center">
        <Popover>
          <PopoverTrigger>
            <button className="w-36 cursor-pointer py-[3px] px-2 border-2 border-black flex items-center justify-between gap-1">
              <p
                className={
                  searchParams.get("dateFilter") ? "" : "text-gray-500"
                }
              >
                {searchParams.get("dateFilter")
                  ? searchParams.get("dateFilter")
                  : "Date filter"}
              </p>
              <ChevronDown className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 px-0 py-0">
            <div className="flex flex-col">
              {Object.entries(DateFilter).map(([key, label]) => (
                <Link
                  href={`/admin/review?${getBaseParams(
                    "dateFilter"
                  )}&dateFilter=${label}`}
                  key={key}
                  className={cn(
                    "px-4 py-2 hover:bg-gray-100",
                    searchParams.get("dateFilter") === label
                      ? "bg-gray-200"
                      : ""
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <button
          onClick={() =>
            redirect(
              `/admin/review?${getBaseParams("search")}&${
                search ? `search=${search}` : ""
              }`
            )
          }
          className="py-[5px] px-4 bg-black text-white cursor-pointer"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
