import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.purchases)['courses']['$get'],
  200
>

export const useGetPurchasedCourses = () => {
  const query = useQuery({
    queryKey: ['purchases', 'courses'],
    queryFn: async () => {
      const response = await client.api.purchases['courses'].$get()

      if (!response.ok) {
        throw new Error('Failed to fetch course')
      }
      const { data } = await response.json()

      return data
    },
  })

  return query
}
