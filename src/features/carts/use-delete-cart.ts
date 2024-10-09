import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.carts)[':id']['$delete']
>

export const useDeleteCart = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async json => {
      const response = await client.api.carts[':id']['$delete']({
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Cart deleted')
      queryClient.invalidateQueries({ queryKey: ['cart', { id }] })
      queryClient.invalidateQueries({ queryKey: ['carts'] })
    },
    onError: () => {
      toast.error('Failed to delete cart')
    },
  })

  return mutation
}
