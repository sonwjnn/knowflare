import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.wishlists)['by-course-id'][':courseId']['$get'],
  200
>

export const useGetWishlistByCourseId = (courseId: string) => {
  const query = useQuery({
    enabled: !!courseId,
    queryKey: ['wishlists', { courseId }],
    queryFn: async () => {
      const response = await client.api.wishlists['by-course-id'][
        ':courseId'
      ].$get({
        param: {
          courseId,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
