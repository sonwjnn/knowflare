import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.purchases)[':courseId']['$get'],
  200
>

export const useGetCurrentPurchase = (id: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['purchase', { id }],
    queryFn: async () => {
      const response = await client.api.purchases[':courseId'].$get({
        param: {
          courseId: id,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch purchase')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
