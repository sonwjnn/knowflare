import { Button } from '@/components/ui/button'
import { useCreateBackup } from '@/features/admin/backups/api/use-create-backup'

export const BackupButton = () => {
  const { mutate, isPending } = useCreateBackup()

  const onClick = () => {
    mutate()
  }

  return (
    <Button
      variant="success"
      className="rounded-md font-normal"
      onClick={onClick}
      disabled={isPending}
    >
      Backup
    </Button>
  )
}
