import { ReviewSearchStatus } from "@/enums/review.enum";
import { SummaryReviewType } from "@/types/review.type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function ReviewsStatusTabs({
  productId,
  summary,
}: {
  productId: string;
  summary: SummaryReviewType;
}) {
  const searchParams = useSearchParams();
  const statusOptions = [
    {
      label: "All",
      value: ReviewSearchStatus.ALL,
      active:
        !searchParams.get("status") ||
        searchParams.get("status") === ReviewSearchStatus.ALL,
      // count: Array.from({ length: 6 }).reduce<number>(
      //   (sum, _, idx) => (summary[idx] ? sum + (summary[idx] || 0) : sum),
      //   0
      // ),
      count: 0,
    },
    {
      label: "Has Picture",
      value: ReviewSearchStatus.WITH_IMAGES,
      active: searchParams.get("status") === ReviewSearchStatus.WITH_IMAGES,
      count: 0,
    },
    {
      label: "1 Star",
      value: ReviewSearchStatus.ONE_STAR,
      active: searchParams.get("status") === ReviewSearchStatus.ONE_STAR,
      count: summary[1] || 0,
    },
    {
      label: "2 Star",
      value: ReviewSearchStatus.TWO_STAR,
      active: searchParams.get("status") === ReviewSearchStatus.TWO_STAR,
      count: summary[2] || 0,
    },
    {
      label: "3 Star",
      value: ReviewSearchStatus.THREE_STAR,
      active: searchParams.get("status") === ReviewSearchStatus.THREE_STAR,
      count: summary[3] || 0,
    },
    {
      label: "4 Star",
      value: ReviewSearchStatus.FOUR_STAR,
      active: searchParams.get("status") === ReviewSearchStatus.FOUR_STAR,
      count: summary[4] || 0,
    },
    {
      label: "5 Star",
      value: ReviewSearchStatus.FIVE_STAR,
      active: searchParams.get("status") === ReviewSearchStatus.FIVE_STAR,
      count: summary[5] || 0,
    },
  ];
  return (
    <div>
      <div className="bg-gray-100 flex flex-wrap gap-2 p-4 ">
        {statusOptions.map((option, idx) => (
          <Link
            href={`/product-detail/${productId}?status=${option.value}`}
            key={idx}
          >
            <p
              className={`p-2 px-4 bg-white border-gray-400 border ${
                option.active ? "text-orange-500" : ""
              }`}
            >
              {option.label} {option.count !== 0 ? `(${option.count})` : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
