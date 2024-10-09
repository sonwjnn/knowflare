import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.carts)[':id']['$patch']
>
type RequestType = InferRequestType<
  (typeof client.api.carts)[':id']['$patch']
>['json']

export const useEditCart = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.carts[':id']['$patch']({
        json,
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Cart updated')
      queryClient.invalidateQueries({ queryKey: ['cart', { id }] })
      queryClient.invalidateQueries({ queryKey: ['carts'] })
    },
    onError: () => {
      toast.error('Failed to edit cart')
    },
  })

  return mutation
}
