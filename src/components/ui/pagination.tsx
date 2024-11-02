// same as the shadcn pagination you're given, so use your own if you wish
import { ButtonProps, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react'
import * as React from 'react'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('hover:cursor-pointer', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  disabled = false,
  ...props
}: PaginationLinkProps) => (
  <PaginationItem>
    <a
      aria-current={isActive ? 'page' : undefined}
      role="link"
      aria-disabled={disabled}
      className={cn(
        buttonVariants({
          variant: isActive ? 'default' : 'ghost',
          size,
        }),
        'rounded-lg',
        isActive ? '' : 'border border-gray-100 bg-white',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className
      )}
      {...props}
    />
  </PaginationItem>
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('px-3', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('px-3', className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)

const PaginationFirst = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to first page"
    size="default"
    className={cn('px-3', className)}
    {...props}
  >
    <ChevronsLeft className="h-4 w-4" />
  </PaginationLink>
)
PaginationFirst.displayName = 'PaginationFirst'

const PaginationLast = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to last page"
    size="default"
    className={cn('px-3', className)}
    {...props}
  >
    <ChevronsRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationLast.displayName = 'PaginationLast'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
}
