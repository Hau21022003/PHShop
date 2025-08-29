// hooks/useReviewFilters.ts
import { FindAllBodySchema } from "@/schemas/review.schema";
import { useCallback } from "react";
import { DateFilter, ReplyStatus } from "@/enums/review.enum";

export function useReviewFilters() {
  const loadFromParams = useCallback((params: URLSearchParams) => {
    const raw = Object.fromEntries(params.entries());

    const transformed = {
      ...raw,
      rating: raw.rating ? Number(raw.rating) : undefined,
      replyStatus: raw.replyStatus as ReplyStatus | undefined,
      dateFilter: raw.dateFilter as DateFilter | undefined,
    };

    const parsed = FindAllBodySchema.parse(transformed);
    return parsed;
  }, []);
  return { loadFromParams };
}
