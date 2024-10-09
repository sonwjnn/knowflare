import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.carts)[':id']['$get'],
  200
>

export const useGetCart = (id: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['cart', { id }],
    queryFn: async () => {
      const response = await client.api.carts[':id'].$get({
        param: {
          id,
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
