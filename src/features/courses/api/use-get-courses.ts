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
}: {
  categoryId?: string
  title?: string
}) => {
  const query = useQuery({
    queryKey: ['courses', title, categoryId],
    queryFn: async () => {
      const response = await client.api.courses.$get({
        query: {
          categoryId,
          title,
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
