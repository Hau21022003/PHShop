import { PageMetaType } from "@/schemas/common.schema";

export function buildPaginatedMeta(
  total: number,
  pageNumber: number,
  pageSize: number
): PageMetaType {
  const totalPages = Math.ceil(total / pageSize);
  return {
    total,
    pageNumber,
    pageSize,
    totalPages,
    hasNextPage: pageNumber < totalPages,
    hasPrevPage: pageNumber > 1,
  };
}
