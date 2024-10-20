import { useTeacherId } from '@/hooks/use-teacher-id'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.wishlists)['add-all-to-cart']['$post'],
  200
>

export const useAddAllToCart = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.wishlists['add-all-to-cart'].$post()

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      return await response.json()
    },
    onSuccess: data => {
      toast.success('Added all to cart.')

      queryClient.invalidateQueries({ queryKey: ['wishlists'] })
      queryClient.invalidateQueries({ queryKey: ['carts'] })
    },
    onError: () => {
      toast.error('Failed to create wishlist. ')
    },
  })

  return mutation
}
