import { useCourseId } from '@/hooks/use-course-id'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.userProgress)['upsert'][':lessonId']['$patch']
>

type RequestType = InferRequestType<
  (typeof client.api.userProgress)['upsert'][':lessonId']['$patch']
>['json']

export const useUpsertProgressLesson = (id: string) => {
  const queryClient = useQueryClient()
  const courseId = useCourseId()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.userProgress['upsert'][':lessonId'][
        '$patch'
      ]({
        param: { lessonId: id },
        json,
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Lesson progress updated')
      queryClient.invalidateQueries({ queryKey: ['chapters', { courseId }] })
      queryClient.invalidateQueries({ queryKey: ['progress'] })
    },
    onError: () => {
      toast.error('Failed to edit chapter')
    },
  })

  return mutation
}
