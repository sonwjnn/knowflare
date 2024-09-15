import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.courses)[':id']['chapters']['reorder']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.courses)[':id']['chapters']['reorder']['$post']
>['json']

export const useReorderChapters = (courseId?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.courses[':id']['chapters']['reorder'][
        '$post'
      ]({
        json,
        param: { id: courseId },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Chapters updated')

      queryClient.invalidateQueries({
        queryKey: ['courses', courseId, 'chapters'],
      })
    },
    onError: () => {
      toast.error('Failed to edit chapters')
    },
  })

  return mutation
}
