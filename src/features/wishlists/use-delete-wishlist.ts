import { useCourseId } from '@/hooks/use-course-id'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.wishlists)[':id']['$delete']
>

export const useDeleteWishlist = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.wishlists[':id']['$delete']({
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Wishlist deleted')
      queryClient.invalidateQueries({ queryKey: ['wishlists', { id }] })

      queryClient.invalidateQueries({ queryKey: ['wishlists'] })
    },
    onError: () => {
      toast.error('Failed to delete wishlist')
    },
  })

  return mutation
}
