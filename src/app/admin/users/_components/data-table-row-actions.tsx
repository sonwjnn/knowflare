import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { insertUsersSchema, users } from '@/db/schema'
import { useDeleteUser } from '@/features/admin/users/api/use-delete-user'
import { useConfirm } from '@/hooks/use-confirm'
import { Row } from '@tanstack/react-table'
import { Ellipsis } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this user'
  )
  const user = insertUsersSchema.parse(row.original)

  const { mutate: deleteUser, isPending: deleteUserLoading } = useDeleteUser(
    user?.id
  )

  const router = useRouter()

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.id || '')
  }

  const handleDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    deleteUser()
  }

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={deleteUserLoading}>
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
            onClick={() => router.push(`/admin/users/edit/${user?.id}`)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopy}>Copy ID</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
