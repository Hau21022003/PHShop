import SearchContainer from "@/app/admin/review/components/search-container";
import { ReplyStatus } from "@/enums/review.enum";
import { cn } from "@/lib/utils";
import { FindAllBody, ReplyStatusSummary } from "@/types/review.type";
import { Check } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function FilterContainer({
  replyStatusSummary,
}: {
  replyStatusSummary?: ReplyStatusSummary;
}) {
  const searchParams = useSearchParams();
  const replyStatusOptions = [
    {
      label: "All",
      value: "",
      active: !searchParams.get("replyStatus"),
      count: 0,
    },
    {
      label: "To Reply",
      value: ReplyStatus.PENDING,
      active: searchParams.get("replyStatus") === ReplyStatus.PENDING,
      count: replyStatusSummary ? replyStatusSummary[ReplyStatus.PENDING] : 0,
    },
    {
      label: "Replied",
      value: ReplyStatus.REPLIED,
      active: searchParams.get("replyStatus") === ReplyStatus.REPLIED,
      count: replyStatusSummary ? replyStatusSummary[ReplyStatus.REPLIED] : 0,
    },
  ];
  const starOptions = [
    {
      label: "All",
      value: undefined,
      active: !searchParams.get("rating"),
      count: 0,
    },
    {
      label: "1 Star",
      value: 1,
      active: Number(searchParams.get("rating")) === 1,
      count: 0,
    },
    {
      label: "2 Star",
      value: 2,
      active: Number(searchParams.get("rating")) === 2,
      count: 0,
    },
    {
      label: "3 Star",
      value: 3,
      active: Number(searchParams.get("rating")) === 3,
      count: 0,
    },
    {
      label: "4 Star",
      value: 4,
      active: Number(searchParams.get("rating")) === 4,
      count: 0,
    },
    {
      label: "5 Star",
      value: 5,
      active: Number(searchParams.get("rating")) === 5,
      count: 0,
    },
  ];
  const getBaseParams = (...excludes: (keyof FindAllBody)[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (excludes) {
      excludes.forEach((exclude) => params.delete(exclude));
    }

    params.delete("pageNumber");

    return params.toString();
  };
  return (
    <div className="space-y-8 md:space-y-6 ">
      <div className="flex items-start flex-col md:flex-row md:items-center gap-4">
        <p className="text-gray-500 shrink-0">Status</p>
        <div className="flex items-center flex-wrap gap-4">
          {replyStatusOptions.map((option) => (
            <Link
              key={option.label}
              href={`/admin/review?${getBaseParams("replyStatus")}&${
                option.value ? `replyStatus=${option.value}` : ""
              }`}
              className={cn(
                "border-2 border-black px-4 py-1 cursor-pointer",
                option.active ? "text-orange-500" : ""
              )}
            >
              {option.label} {option.count !== 0 ? `(${option.count})` : ""}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-start flex-col md:flex-row md:items-center gap-4">
        <p className="text-gray-500 shrink-0">Star Rating</p>
        <div className="flex items-center flex-wrap gap-4">
          {starOptions.map((option) => (
            <div
              key={option.label}
              className="flex items-center flex-wrap gap-2"
            >
              <Link
                href={`/admin/review?${getBaseParams("rating")}&${
                  option.value ? `rating=${option.value}` : ""
                }`}
              >
                <div
                  className={cn(
                    "w-7 h-7 flex items-center justify-center border border-black",
                    option.active ? "bg-black text-white" : ""
                  )}
                >
                  <Check className="w-5 h-5" />
                </div>
              </Link>
              <p>
                {option.label} {option.count !== 0 ? `(${option.count})` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>

      <SearchContainer />
    </div>
  );
}
