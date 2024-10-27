import { useLessonId } from '@/hooks/use-lesson-id'
import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.comments)['$get'],
  200
>

export const useGetComments = (courseId: string) => {
  const lessonId = useLessonId()

  const query = useQuery({
    enabled: !!lessonId,
    queryKey: ['comments'],
    queryFn: async () => {
      const response = await client.api.comments.$get({
        query: {
          courseId,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch comments')
      }
      const { data } = await response.json()

      return data
    },
  })

  return query
}
