import { useState, useCallback } from "react";
import { reviewApiRequest } from "@/api-requests/review";
import { handleErrorApi } from "@/lib/error";
import {
  ReviewWithProduct,
  ReplyStatusSummary,
  FindAllBody,
  RatingSummary,
} from "@/types/review.type";
import { closeLoading, showLoading } from "@/components/loading-overlay";
import { defaultPageMeta, PageMetaType } from "@/schemas/common.schema";
import { buildPaginatedMeta } from "@/utils/pagination";

export function useReviews() {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
  const [pageMeta, setPageMeta] = useState<PageMetaType>(defaultPageMeta);
  const [replyStatusSummary, setReplyStatusSummary] =
    useState<ReplyStatusSummary>();
  const [ratingSummary, setRatingSummary] = useState<RatingSummary>();

  const fetchReviews = useCallback(async (query: FindAllBody) => {
    try {
      showLoading();
      const { items, total, replyStatusSummary, ratingSummary } = (
        await reviewApiRequest.findAll(query)
      ).payload;
      const newPageMeta = buildPaginatedMeta(
        total,
        query.pageNumber || 1,
        query.pageSize || 10
      );
      setReviews(items);
      setReplyStatusSummary(replyStatusSummary);
      setPageMeta(newPageMeta);
      setRatingSummary(ratingSummary);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      closeLoading();
    }
  }, []);

  return { reviews, replyStatusSummary, ratingSummary, pageMeta, fetchReviews };
}
