import { client } from '@/lib/hono'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.purchases)['$get'],
  200
>

export const useGetPurchases = () => {
  const query = useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const response = await client.api.purchases.$get()

      if (!response.ok) {
        throw new Error('Failed to fetch purchase')
      }
      const { data } = await response.json()

      return data
    },
  })

  return query
}
