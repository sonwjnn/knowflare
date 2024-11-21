import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.coupons)[':id']['$get'],
  200
>

export const useGetCoupon = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['coupon', { id }],
    queryFn: async () => {
      const response = await client.api.coupons[':id'].$get({
        param: {
          id: id,
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
