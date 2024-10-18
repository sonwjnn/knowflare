import { CourseLevel } from '@/db/schema'
import { client } from '@/lib/hono'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.courses)['$get'],
  200
>

export const useGetCourses = ({
  categoryId,
  title,
  level,
}: {
  categoryId?: string
  title?: string
  level?: string
}) => {
  const query = useQuery({
    queryKey: ['courses', title, categoryId, level],
    queryFn: async () => {
      const response = await client.api.courses.$get({
        query: {
          categoryId,
          title,
          level,
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
