import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.categories)['bulk-delete']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.admin.categories)['bulk-delete']['$post']
>['json']

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.admin.categories['bulk-delete'][
        '$post'
      ]({
        json,
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('User deleted')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: () => {
      toast.error('Failed to delete categories')
    },
  })

  return mutation
}
