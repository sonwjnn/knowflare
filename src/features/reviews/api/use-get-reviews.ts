import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.reviews)['$get'],
  200
>

export const useGetReviews = (courseId: string) => {
  const query = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const response = await client.api.reviews.$get({
        query: {
          courseId,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      const { data } = await response.json()

      return data
    },
  })

  return query
}
