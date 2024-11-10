import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.lessons)['$post'],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.admin.lessons)['$post']
>['json']

export const useCreateLesson = ({
  courseId,
  chapterId,
}: {
  courseId: string
  chapterId: string
}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.admin.lessons.$post({
        json: {
          ...json,
          courseId,
          chapterId,
        },
      })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Lesson created.')
      queryClient.invalidateQueries({
        queryKey: ['lessons', { chapterId }],
      })
    },
    onError: () => {
      toast.error(
        'Failed to create lesson. The session token may have expired, logout and login again, and everything will work fine.'
      )
    },
  })

  return mutation
}
