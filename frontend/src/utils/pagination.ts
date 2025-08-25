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

export const getVisiblePages = (
  totalPages: number,
  currentPage: number,
  maxVisible = 5
): (number | string)[] => {
  const pages: (number | string)[] = [];

  if (totalPages <= maxVisible + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  pages.push(1);

  if (currentPage <= 3) {
    pages.push(2, 3, 4, "...", totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    );
  } else {
    pages.push(
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages
    );
  }

  return pages;
};
