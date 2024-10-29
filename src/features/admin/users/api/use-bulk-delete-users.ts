import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.users)['bulk-delete']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.users)['bulk-delete']['$post']
>['json']

export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.users['bulk-delete']['$post']({
        json,
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('User deleted')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Failed to delete users')
    },
  })

  return mutation
}
