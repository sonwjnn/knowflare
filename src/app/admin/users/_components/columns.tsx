import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { users } from '@/db/schema'
import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'

import {
  labels,
  priorities,
  roleOptions,
  statusOptions,
  statuses,
} from '../_data/data'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Omit<typeof users.$inferSelect, 'password'>>[] =
  [
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
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const label = labels.find(label => label.value === row.original.name)
        const image = row.original.image as string
        const name = row.getValue('name') as string

        return (
          <div className="flex items-center space-x-2">
            <Avatar className="size-6 cursor-pointer transition hover:opacity-75">
              <AvatarImage alt={name} src={image} />
              <AvatarFallback className="flex items-center justify-center bg-blue-500 font-medium text-white">
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('name')}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        return (
          <div className="line-clamp-1 flex items-center">
            <span className="truncate">{row.getValue('email')}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        const rowValue = row.getValue(id) as string

        return rowValue.includes(value)
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const role = roleOptions.find(
          role => role.value === row.getValue('role')
        )

        if (!role) {
          return null
        }

        return (
          <div className="flex items-center">
            {/* {priority.icon && (
              <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )} */}
            <span>{row.getValue('role')}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },

    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const value = !!row.original.emailVerified ? 'active' : 'inactive'
        const active = !!row.original.emailVerified

        const status = statusOptions.find(status => status.value === value)

        if (!status) {
          return null
        }

        return (
          <div className="flex items-center">
            <Badge
              className={cn(
                'py-1 text-xs font-semibold',
                active &&
                  'bg-emerald-200 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-700',
                !active &&
                  'bg-rose-200 text-rose-700 hover:bg-rose-200 hover:text-rose-700'
              )}
            >
              {active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(
          row.original.emailVerified ? 'active' : 'inactive'
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
