import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.courses)[':courseId']['chapters'][':chapterId']['$get'],
  200
>

export const useGetChapter = ({
  chapterId,
  courseId,
}: {
  chapterId: string
  courseId: string
}) => {
  const query = useQuery({
    enabled: !!chapterId || !!courseId,
    queryKey: ['chapter', { chapterId }],
    queryFn: async () => {
      const response = await client.api.courses[':courseId']['chapters'][
        ':chapterId'
      ].$get({
        param: {
          chapterId,
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
