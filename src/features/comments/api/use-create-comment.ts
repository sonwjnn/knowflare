import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.comments)['$post'],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.comments)['$post']
>['json']

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.comments.$post({ json })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Comment created.')

      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
    onError: () => {
      toast.error(
        'Failed to create comment. The session token may have expired, logout and login again, and everything will work fine.'
      )
    },
  })

  return mutation
}
