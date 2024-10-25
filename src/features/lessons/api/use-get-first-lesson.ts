import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.lessons)[':courseId']['first-lesson']['$get'],
  200
>

export const useGetFirstLesson = ({ courseId }: { courseId: string }) => {
  const query = useQuery({
    enabled: !!courseId,
    queryKey: ['first-lesson', { courseId }],
    queryFn: async () => {
      const response = await client.api.lessons[':courseId'][
        'first-lesson'
      ].$get({
        param: {
          courseId,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch first lesson')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
