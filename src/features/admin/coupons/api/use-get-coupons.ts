import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.admin.coupons)['$get'],
  200
>

export const useGetCoupons = () => {
  const query = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const response = await client.api.admin.coupons.$get()

      if (!response.ok) {
        throw new Error('Failed to fetch coupons')
      }

      const { data } = await response.json()
      return data
    },
  })

  return query
}
