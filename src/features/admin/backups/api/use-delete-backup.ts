import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.backups)[':id']['$delete']
>

export const useDeleteBackup = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async json => {
      const response = await client.api.admin.backups[':id']['$delete']({
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Backup deleted')
      queryClient.invalidateQueries({ queryKey: ['backup', { id }] })
      queryClient.invalidateQueries({ queryKey: ['backups'] })
    },
    onError: () => {
      toast.error('Failed to delete backup')
    },
  })

  return mutation
}
