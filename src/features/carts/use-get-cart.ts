import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.carts)['by-course-id'][':courseId']['$get'],
  200
>

export const useGetCartByCourseId = (courseId: string) => {
  const query = useQuery({
    enabled: !!courseId,
    queryKey: ['carts', { courseId }],
    queryFn: async () => {
      const response = await client.api.carts['by-course-id'][':courseId'].$get(
        {
          param: {
            courseId,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch cart')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
