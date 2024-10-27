import { useCourseId } from '@/hooks/use-course-id'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.userProgress)['upsert'][':lessonId']['$post']
>

type RequestType = InferRequestType<
  (typeof client.api.userProgress)['upsert'][':lessonId']['$post']
>['json']

export const useUpsertProgressLesson = (lessonId: string) => {
  const queryClient = useQueryClient()
  const courseId = useCourseId()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.userProgress['upsert'][':lessonId'][
        '$post'
      ]({
        param: { lessonId },
        json,
      })

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['progress', { lessonId }],
      })
      queryClient.invalidateQueries({ queryKey: ['chapters', { courseId }] })
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
    },
    onError: () => {
      toast.error('Failed to edit chapter')
    },
  })

  return mutation
}
