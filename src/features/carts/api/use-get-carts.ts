import { client } from '@/lib/hono'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.carts)['$get'],
  200
>

export const useGetCarts = () => {
  const query = useQuery({
    queryKey: ['carts'],
    queryFn: async () => {
      const response = await client.api.carts.$get()

      if (!response.ok) {
        throw new Error('Failed to fetch cart')
      }
      const { data } = await response.json()

      return data
    },
  })

  return query
}
