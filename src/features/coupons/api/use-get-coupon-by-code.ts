import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.coupons)['by-code'][':code']['$get'],
  200
>

export const useGetCouponByCode = (code?: string) => {
  const query = useQuery({
    enabled: !!code,
    queryKey: ['coupon', { code }],
    queryFn: async () => {
      const response = await client.api.coupons['by-code'][':code'].$get({
        param: {
          code,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch coupon')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
