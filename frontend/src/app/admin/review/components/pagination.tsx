import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PageMetaType } from "@/schemas/common.schema";
import { getVisiblePages } from "@/utils/pagination";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function PaginationContainer({
  pageMeta,
}: {
  pageMeta: PageMetaType;
}) {
  const visiblePages = getVisiblePages(
    pageMeta.totalPages,
    pageMeta.pageNumber,
    5
  );
  const searchParams = useSearchParams();
  const getBaseParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    return params.toString();
  };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?${getBaseParams()}&pageNumber=${pageMeta.pageNumber - 1}`}
            aria-disabled={!pageMeta.hasPrevPage}
            className={
              !pageMeta.hasPrevPage ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
        {/* Page numbers */}
        {visiblePages.map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={`?${getBaseParams()}&pageNumber=${page}`}
                isActive={page === pageMeta.pageNumber}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={`?${getBaseParams()}&pageNumber=${pageMeta.pageNumber + 1}`}
            aria-disabled={!pageMeta.hasNextPage}
            className={
              !pageMeta.hasNextPage ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
