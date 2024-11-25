import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.backups)['bulk-delete']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.admin.backups)['bulk-delete']['$post']
>['json']

export const useBulkDeleteBackups = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.admin.backups['bulk-delete']['$post']({
        json,
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Backup deleted')
      queryClient.invalidateQueries({ queryKey: ['backups'] })
    },
    onError: () => {
      toast.error('Failed to delete backups')
    },
  })

  return mutation
}
