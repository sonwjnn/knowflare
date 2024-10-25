import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.lessons)[':id']['$get'],
  200
>

export const useGetLesson = ({
  lessonId,
  courseId,
}: {
  lessonId: string
  courseId: string
}) => {
  const query = useQuery({
    enabled: !!lessonId,
    queryKey: ['lesson', { lessonId }],
    queryFn: async () => {
      const response = await client.api.lessons[':id'].$get({
        param: {
          id: lessonId,
        },
        query: {
          courseId,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch course')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
