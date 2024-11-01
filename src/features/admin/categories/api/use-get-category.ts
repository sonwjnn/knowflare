import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.categories)[':id']['$get'],
  200
>

export const useGetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['category', { id }],
    queryFn: async () => {
      const response = await client.api.categories[':id'].$get({
        param: {
          id: id,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch category')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
