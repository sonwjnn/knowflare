import { client } from '@/lib/hono'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.carts)['$get'],
  200
>

export const useGetCarts = ({
  categoryId,
  title,
}: {
  categoryId?: string
  title?: string
}) => {
  const query = useQuery({
    queryKey: ['carts', title, categoryId],
    queryFn: async () => {
      const response = await client.api.carts.$get({
        query: {
          categoryId,
          title,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch cart')
      }
      const { data } = await response.json()

      return data
    },
  })

  return query
}
