import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { users } from '@/db/schema'
import { ColumnDef } from '@tanstack/react-table'

import { labels, priorities, statuses } from '../_data/data'
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

        return (
          <div className="flex space-x-2">
            {label && <Badge variant="outline">{label.label}</Badge>}
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
        // const status = statuses.find(
        //   status => status.value === row.getValue('email')
        // )

        // if (!status) {
        //   return null
        // }

        return (
          <div className="line-clamp-1 flex items-center">
            <span className="truncate">{row.getValue('email')}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        // const priority = priorities.find(
        //   priority => priority.value === row.getValue('priority')
        // )

        // if (!priority) {
        //   return null
        // }

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
      accessorKey: 'emailVerified',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        // const priority = priorities.find(
        //   priority => priority.value === row.getValue('priority')
        // )

        // if (!priority) {
        //   return null
        // }

        return (
          <div className="flex items-center">
            {/* {priority.icon && (
              <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )} */}
            <span>{`${!!row.getValue('emailVerified')}`}</span>
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
