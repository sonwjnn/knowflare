import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { insertBackupsSchema } from '@/db/schema'
import { useDeleteBackup } from '@/features/admin/backups/api/use-delete-backup'
import { useRestoreBackup } from '@/features/admin/backups/api/use-restore'
import { useConfirm } from '@/hooks/use-confirm'
import { Row } from '@tanstack/react-table'
import { Download, Ellipsis } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IoCopyOutline } from 'react-icons/io5'
import { MdRestore } from 'react-icons/md'
import { PiTrashSimpleBold } from 'react-icons/pi'
import { toast } from 'sonner'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this backup'
  )
  const [ConfirmDialogRestore, confirmRestore] = useConfirm(
    'Are you sure?',
    'You are about to restore this backup'
  )
  const backup = insertBackupsSchema.parse(row.original)

  const { mutate: deleteBackup, isPending: deleteBackupLoading } =
    useDeleteBackup(backup?.id)
  const { mutate: restoreBackup, isPending: restoreBackupLoading } =
    useRestoreBackup()

  const router = useRouter()

  const handleCopy = () => {
    navigator.clipboard.writeText(backup?.id || '')
  }

  const handleDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    deleteBackup()
  }

  const handleRestore = async () => {
    const ok = await confirmRestore()

    if (!ok) return

    restoreBackup({ fileUrl: backup.fileUrl })
  }

  const handleDownload = () => {
    if (!backup.fileUrl) {
      toast.error('File URL is not available')
      return
    }

    const anchor = document.createElement('a')
    anchor.href = backup.fileUrl
    anchor.download = backup.fileUrl.split('/').pop() || 'backup-file'
    anchor.target = '_blank'
    anchor.click()

    anchor.remove()
  }

  return (
    <>
      <ConfirmDialog />
      <ConfirmDialogRestore />
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={deleteBackupLoading}>
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
            onClick={handleRestore}
            disabled={restoreBackupLoading}
          >
            <MdRestore className="mr-1 h-4 w-4" />
            Restore
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopy}>
            <IoCopyOutline className="mr-1 h-4 w-4" /> Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="mr-1 h-4 w-4" /> Download
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
