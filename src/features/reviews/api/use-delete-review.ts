import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.reviews)[':id']['$delete']
>

export const useDeleteReview = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async json => {
      const response = await client.api.reviews[':id']['$delete']({
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Review deleted')
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
    onError: () => {
      toast.error('Failed to delete review')
    },
  })

  return mutation
}
