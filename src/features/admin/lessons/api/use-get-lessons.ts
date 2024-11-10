import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.admin.lessons)['$get'],
  200
>

export const useGetLessons = ({
  chapterId,
  courseId,
}: {
  chapterId: string
  courseId: string
}) => {
  const query = useQuery({
    enabled: !!chapterId,
    queryKey: ['lessons'],
    queryFn: async () => {
      const response = await client.api.admin.lessons.$get({
        query: { chapterId, courseId },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch lessons')
      }

      const { data } = await response.json()
      return data
    },
  })

  return query
}
