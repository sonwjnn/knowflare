import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.directMessages)['$post'],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.directMessages)['$post']
>['json']

export const useCreateDirectMessage = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.directMessages.$post({ json })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      return await response.json()
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['direct-messages'] })
    },
    onError: () => {
      toast.error('Failed to create message. ')
    },
  })

  return mutation
}
