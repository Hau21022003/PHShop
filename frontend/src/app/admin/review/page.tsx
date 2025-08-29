"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import FilterContainer from "@/app/admin/review/components/filter-container";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useReviewFilters } from "@/app/admin/review/hooks/use-review-filters";
import { useReviews } from "@/app/admin/review/hooks/use-reviews";
import ReviewTable from "@/app/admin/review/components/review-table";

export default function ReviewPage() {
  const { loadFromParams } = useReviewFilters();
  const { reviews, replyStatusSummary, fetchReviews } = useReviews();

  const searchParams = useSearchParams();
  useEffect(() => {
    const query = loadFromParams(searchParams);
    fetchReviews(query);
  }, [searchParams, loadFromParams, fetchReviews]);
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto space-y-4">
        {/* Header */}
        <div className="hidden md:block p-4 border-2 border-black">
          <FilterContainer replyStatusSummary={replyStatusSummary} />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden cursor-pointer px-4 py-2 border-2 border-black flex items-center gap-1">
              <SlidersHorizontal className="w-4 h-4" />
              <p className="leading-none">Filter</p>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="h-full overflow-y-auto">
            <div className="px-4 pt-12">
              <FilterContainer replyStatusSummary={replyStatusSummary} />
            </div>
          </SheetContent>
        </Sheet>
        <ReviewTable reviews={reviews} />
      </div>
    </div>
  );
}
