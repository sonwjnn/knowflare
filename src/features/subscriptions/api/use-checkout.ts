import { client } from '@/lib/hono'
import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.subscriptions.checkout)['$post'],
  200
>

type RequestType = InferRequestType<
  (typeof client.api.subscriptions.checkout)['$post']
>['json']

export const useCheckout = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.subscriptions.checkout.$post({ json })

      if (!response.ok) {
        throw new Error('Failed to create session')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      window.location.href = data
    },
    onError: () => {
      toast.error('Failed to create session')
    },
  })

  return mutation
}
