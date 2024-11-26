import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateBackup } from '@/features/admin/backups/api/use-create-backup'
import { Loader2, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const CreateForm = () => {
  const router = useRouter()
  const { mutate: createBackup, isPending: createBackupLoading } =
    useCreateBackup()
  const [fileUrl, setFileUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    createBackup(undefined, {
      onSuccess: () => {
        router.push('/admin/backups')
      },
    })
  }

  if (createBackupLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-8">
        <div className="pt-8">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
            <div className="sm:col-span-2">
              <Label
                htmlFor="fileUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <Input
                  id="fileUrl"
                  name="fileUrl"
                  value={fileUrl}
                  onChange={e => setFileUrl(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <Button type="submit" disabled={createBackupLoading}>
            {createBackupLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
