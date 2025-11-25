import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "../ui/pagination";

export default function AppPagination({
  total,
  limit,
  page,
  onPageChange,
}: {
  total: number;
  limit: number;
  page: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="py-[1.1rem]"
            >
              <ChevronLeftIcon />
            </Button>
          </PaginationItem>

          {/* Dynamic pagination numbers */}
          {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1)
            .slice(
              Math.max(0, page - 3),
              Math.min(Math.ceil(total / limit), page + 2)
            )
            .map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={pageNumber === page}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(pageNumber);
                  }}
                  className={`border-primary ${
                    pageNumber === page ? "text-primary" : ""
                  }`}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}

          {page + 2 < Math.ceil(total / limit) && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page * limit >= total}
              className="py-[1.1rem]"
            >
              <ChevronRightIcon />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
