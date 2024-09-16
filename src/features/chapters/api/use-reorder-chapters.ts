import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.chapters)['reorder']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.chapters)['reorder']['$post']
>['json']

export const useReorderChapters = (courseId?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.chapters['reorder']['$post']({
        json,
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Chapters updated')

      queryClient.invalidateQueries({
        queryKey: ['chapters', { courseId }],
      })
    },
    onError: () => {
      toast.error('Failed to edit chapters')
    },
  })

  return mutation
}
