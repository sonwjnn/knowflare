// this is where you'd implement some pagination logic like whether a next page is available, which can then be imported to the DataTable
import { generatePaginationLinks } from '@/components/generate-pages'
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type PaginatorProps = {
  currentPage: number
  totalPages: number
  onPageChange: (pageNumber: number) => void
  showPreviousNext: boolean
}

export default function Paginator({
  currentPage,
  totalPages,
  onPageChange,
  showPreviousNext,
}: PaginatorProps) {
  return (
    <Pagination>
      <PaginationContent>
        {showPreviousNext && totalPages ? (
          <>
            <PaginationItem>
              <PaginationFirst
                onClick={() => onPageChange(1)}
                disabled={currentPage - 1 < 1}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage - 1 < 1}
              />
            </PaginationItem>
          </>
        ) : null}
        {generatePaginationLinks(currentPage, totalPages, onPageChange)}
        {showPreviousNext && totalPages ? (
          <>
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage > totalPages - 1}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage > totalPages - 1}
              />
            </PaginationItem>
          </>
        ) : null}
      </PaginationContent>
    </Pagination>
  )
}
