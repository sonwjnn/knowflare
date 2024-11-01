import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { categories, insertCategoriesSchema } from '@/db/schema'
import { useDeleteCategory } from '@/features/admin/categories/api/use-delete-category'
import { useConfirm } from '@/hooks/use-confirm'
import { Row } from '@tanstack/react-table'
import { Ellipsis } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IoCopyOutline } from 'react-icons/io5'
import { PiTrashSimpleBold } from 'react-icons/pi'
import { RiEditBoxLine } from 'react-icons/ri'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this category'
  )
  const category = insertCategoriesSchema.parse(row.original)

  const { mutate: deleteCategory, isPending: deleteCategoryLoading } =
    useDeleteCategory(category?.id)

  const router = useRouter()

  const handleCopy = () => {
    navigator.clipboard.writeText(category?.id || '')
  }

  const handleDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    deleteCategory()
  }

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={deleteCategoryLoading}>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() =>
              router.push(`/admin/categories/edit/${category?.id}`)
            }
          >
            <RiEditBoxLine className="mr-1 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopy}>
            <IoCopyOutline className="mr-1 h-4 w-4" /> Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="hover:bg-rose-200 hover:text-rose-700"
          >
            <PiTrashSimpleBold className="mr-1 h-4 w-4" /> Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
