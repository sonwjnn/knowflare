import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.courses)[':id']['unpublish']['$patch']
>

export const useUnpublishCourse = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.courses[':id']['unpublish']['$patch']({
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Course unpublished')
      queryClient.invalidateQueries({ queryKey: ['course', { id }] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['purchases', 'courses'] })
    },
    onError: () => {
      toast.error('Failed to edit course')
    },
  })

  return mutation
}
