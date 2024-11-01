import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { users } from '@/db/schema'
import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import {
  labels,
  levelOptions,
  priorities,
  publishedOptions,
  roleOptions,
  statuses,
} from '../_data/data'
import { Course } from '../_data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Course>[] = [
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
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('title')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>${row.getValue('price')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: 'level',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level" />
    ),
    cell: ({ row }) => {
      const level = levelOptions.find(
        item => item.value === row.getValue('level')
      )

      if (!level) {
        return null
      }

      return (
        <div className="flex items-center">
          <span className="capitalize">{row.getValue('level')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date created" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{format(row.getValue('date'), 'dd/MM/yyyy')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'isPublished',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published" />
    ),
    cell: ({ row }) => {
      const rowValue = !!row.getValue('isPublished')

      const isPublished = publishedOptions.find(item => {
        if (rowValue) {
          return item.value === 'published'
        }
        return item.value === 'unpublished'
      })

      if (!isPublished) {
        return null
      }

      return (
        <div className="flex items-center">
          <Badge
            className={cn(
              'py-1 text-xs font-semibold',
              isPublished &&
                'bg-emerald-200 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-700',
              !isPublished &&
                'bg-rose-200 text-rose-700 hover:bg-rose-200 hover:text-rose-700'
            )}
          >
            {isPublished ? 'Published' : 'Unpublished'}
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
