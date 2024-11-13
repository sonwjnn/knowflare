import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.categories)['list']['top-categories-last-three-week']['$get'],
  200
>

export const useGetTopCategories = () => {
  const query = useQuery({
    queryKey: ['top-categories'],
    queryFn: async () => {
      const response =
        await client.api.categories['list'][
          'top-categories-last-three-week'
        ].$get()

      if (!response.ok) {
        throw new Error('Failed to fetch course')
      }

      const { data } = await response.json()
      return data
    },
  })

  return query
}
