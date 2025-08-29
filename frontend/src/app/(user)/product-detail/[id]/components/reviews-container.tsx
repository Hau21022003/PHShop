/* eslint-disable @next/next/no-img-element */
"use client";
import { ProductDetailType } from "@/schemas/product.schema";
import React, { useEffect, useState } from "react";
import { Review, SummaryReviewType } from "@/types/review.type";
import ReviewsStatusTabs from "@/app/(user)/product-detail/[id]/components/reviews-status-tabs";
import { handleErrorApi } from "@/lib/error";
import { reviewApiRequest } from "@/api-requests/review";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FindByProductBody } from "@/schemas/review.schema";
import { useSearchParams } from "next/navigation";
import { ReviewSearchStatus } from "@/enums/review.enum";
import ReviewsStarSummary from "@/app/(user)/product-detail/[id]/components/reviews-star-summary";
import ReviewItem from "@/app/(user)/product-detail/[id]/components/review-item";

interface ReviewsContainerProps {
  open: boolean;
  product: ProductDetailType;
}

export default function ReviewsContainer({
  open,
  product,
}: ReviewsContainerProps) {
  const searchParams = useSearchParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<SummaryReviewType>();
  const findReviewByProductForm = useForm({
    resolver: zodResolver(FindByProductBody),
    defaultValues: {},
  });

  const fetchReviews = async () => {
    try {
      const { summary, items } = (
        await reviewApiRequest.findByProduct(
          findReviewByProductForm.getValues()
        )
      ).payload;
      setSummary(summary);
      setReviews(items);
      console.log("items", items);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  useEffect(() => {
    findReviewByProductForm.reset({
      productId: product._id,
      status:
        (searchParams.get("status") as ReviewSearchStatus) ||
        ReviewSearchStatus.ALL,
    });
    fetchReviews();
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-20">
      {/* Star mobile */}
      {/* <div className="lg:hidden"></div> */}
      <div className="lg:hidden">
        {summary && <ReviewsStarSummary summary={summary} />}
      </div>
      {/* Reviews */}
      <div className="mt-8 lg:mt-0 lg:flex-1 space-y-14">
        {summary && (
          <ReviewsStatusTabs summary={summary} productId={product._id} />
        )}
        {/* Filter item */}
        {reviews.map((review) => (
          <ReviewItem review={review} key={review._id} />
        ))}
      </div>
      {/* Star desktop */}
      <div className="hidden lg:block lg:w-72 space-y-4">
        {summary && <ReviewsStarSummary summary={summary} />}
      </div>
    </div>
  );
}
