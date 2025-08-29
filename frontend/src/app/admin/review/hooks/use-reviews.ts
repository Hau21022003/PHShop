import { useState, useCallback } from "react";
import { reviewApiRequest } from "@/api-requests/review";
import { handleErrorApi } from "@/lib/error";
import {
  ReviewWithProduct,
  ReplyStatusSummary,
  FindAllBody,
} from "@/types/review.type";
import { closeLoading, showLoading } from "@/components/loading-overlay";

export function useReviews() {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
  const [replyStatusSummary, setReplyStatusSummary] =
    useState<ReplyStatusSummary>();

  const fetchReviews = useCallback(async (query: FindAllBody) => {
    try {
      showLoading();
      const { items, replyStatusSummary } = (
        await reviewApiRequest.findAll(query)
      ).payload;
      setReviews(items);
      setReplyStatusSummary(replyStatusSummary);
      console.log("items", items);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      closeLoading();
    }
  }, []);

  return { reviews, replyStatusSummary, fetchReviews };
}
