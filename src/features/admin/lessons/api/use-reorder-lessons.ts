import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.lessons)['reorder']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.admin.lessons)['reorder']['$post']
>['json']

export const useReorderLessons = ({
  courseId,
  chapterId,
}: {
  courseId: string
  chapterId: string
}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.admin.lessons['reorder']['$post']({
        json,
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Lessons updated')

      queryClient.invalidateQueries({
        queryKey: ['lessons', { courseId }],
      })
    },
    onError: () => {
      toast.error('Failed to edit lessons')
    },
  })

  return mutation
}
