import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.courses)['bulk-delete']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.admin.courses)['bulk-delete']['$post']
>['json']

export const useBulkDeleteCourses = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.admin.courses['bulk-delete']['$post']({
        json,
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('User deleted')
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
    onError: () => {
      toast.error('Failed to delete courses')
    },
  })

  return mutation
}
