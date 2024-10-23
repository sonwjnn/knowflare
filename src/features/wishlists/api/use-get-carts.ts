import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.wishlists)['$get'],
  200
>

export const useGetWishlists = () => {
  const query = useQuery({
    queryKey: ['wishlists'],
    queryFn: async () => {
      const response = await client.api.wishlists.$get()

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist')
      }
      const { data } = await response.json()

      return data
    },
  })

  return query
}
