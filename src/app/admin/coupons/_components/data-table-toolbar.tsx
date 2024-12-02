import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { useCreateCouponModal } from '@/features/admin/coupons/store/use-create-coupon-modal'
import { useConfirm } from '@/hooks/use-confirm'
import { Row, Table } from '@tanstack/react-table'
import Link from 'next/link'

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
    'You are about to delete this selected coupon'
  )
  const [_, setOpen] = useCreateCouponModal()
  const isFiltered = table.getState().columnFilters.length > 0
  const isSelected = table.getFilteredSelectedRowModel().rows.length > 0

  const handleDeleteSelected = async () => {
    const ok = await confirm()

    if (!ok) return

    onDelete(table.getFilteredSelectedRowModel().rows)
    table.resetRowSelection()
  }

  return (
    <div className="flex items-center justify-between">
      <ConfirmDialog />
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Filter coupons..."
          value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('code')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
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
          Create Coupon
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
