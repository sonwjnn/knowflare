import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { useCreateCourseModal } from '@/features/admin/courses/store/use-create-course-modal'
import { useGetUsersHaveCourse } from '@/features/admin/users/api/use-get-users-have-course'
import { useConfirm } from '@/hooks/use-confirm'
import { Row, Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import Link from 'next/link'

import { categoryOptions, levelOptions, publishedOptions } from '../_data/data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onDelete: (rows: Row<TData>[]) => void
}

export function DataTableToolbar<TData>({
  table,
  onDelete,
}: DataTableToolbarProps<TData>) {
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this selected user'
  )
  const { data: users, isPending: usersLoading } = useGetUsersHaveCourse()
  const [_, setOpen] = useCreateCourseModal()
  const isFiltered = table.getState().columnFilters.length > 0
  const isSelected = table.getFilteredSelectedRowModel().rows.length > 0

  const handleDeleteSelected = async () => {
    const ok = await confirm()

    if (!ok) return

    onDelete(table.getFilteredSelectedRowModel().rows)
    table.resetRowSelection()
  }

  const normalizedUsers = (users ?? []).map(user => ({
    value: user.id,
    label: user.name || '',
  }))

  return (
    <div className="flex items-center justify-between">
      <ConfirmDialog />
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Filter courses by title..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn('author') && (
            <DataTableFacetedFilter
              column={table.getColumn('author')}
              title="Author"
              options={normalizedUsers}
            />
          )}
          {table.getColumn('category') && (
            <DataTableFacetedFilter
              column={table.getColumn('category')}
              title="Category"
              options={categoryOptions}
            />
          )}
          {table.getColumn('level') && (
            <DataTableFacetedFilter
              column={table.getColumn('level')}
              title="Level"
              options={levelOptions}
            />
          )}
          {table.getColumn('isPublished') && (
            <DataTableFacetedFilter
              column={table.getColumn('isPublished')}
              title="Published"
              options={publishedOptions}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        {isSelected && (
          <Button
            size="sm"
            className="hidden h-8 bg-rose-100 text-rose-700 hover:bg-rose-50 hover:text-rose-700 lg:flex"
            onClick={handleDeleteSelected}
          >
            Delete{' '}
            <span className="ml-1 text-xs">
              ({table.getFilteredSelectedRowModel().rows.length})
            </span>
          </Button>
        )}

        <Button size="sm" className="h-8" onClick={() => setOpen(true)}>
          Create Course
        </Button>

        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
