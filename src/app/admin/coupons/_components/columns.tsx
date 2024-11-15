import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { categoryOptions } from '../_data/data'
import { Coupon } from '../_data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Coupon>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('code')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'discountAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount Amount" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue('discountAmount')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const rowCategory = row.getValue('category') as {
        id: string
        name: string
      }

      const category = categoryOptions.find(
        item => item.value === rowCategory.id
      )

      if (!category) {
        return null
      }

      return (
        <div className="flex items-center">
          <span className="capitalize">{rowCategory.name}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id) as {
        id: string
        name: string
      }
      return value.includes(rowValue.id)
    },
  },
  {
    accessorKey: 'expires',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{format(row.getValue('expires'), 'dd/MM/yyyy')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const rowValue = !!row.getValue('isActive')

      return (
        <div className="flex items-center">
          <Badge
            className={cn(
              'py-1 text-xs font-semibold',
              rowValue &&
                'bg-emerald-200 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-700',
              !rowValue &&
                'bg-rose-200 text-rose-700 hover:bg-rose-200 hover:text-rose-700'
            )}
          >
            {rowValue ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
