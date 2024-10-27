import { useCourseId } from '@/hooks/use-course-id'
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
    mutationFn: async () => {
      const response = await client.api.carts[':id']['$delete']({
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts', { id }] })

      queryClient.invalidateQueries({ queryKey: ['carts'] })
    },
    onError: () => {
      toast.error('Failed to delete cart')
    },
  })

  return mutation
}
