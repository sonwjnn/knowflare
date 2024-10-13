import { useTeacherId } from '@/hooks/use-teacher-id'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.wishlists)['$post'],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.wishlists)['$post']
>['json']

export const useCreateWishlist = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.wishlists.$post({ json })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      return await response.json()
    },
    onSuccess: data => {
      toast.success('Added wishlist.')

      queryClient.invalidateQueries({ queryKey: ['wishlists'] })
    },
    onError: () => {
      toast.error('Failed to create wishlist. ')
    },
  })

  return mutation
}
