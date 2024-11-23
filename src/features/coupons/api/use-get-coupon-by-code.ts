import { client } from '@/lib/hono'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.coupons)['by-code']['$post'],
  200
>

type RequestType = InferRequestType<
  (typeof client.api.coupons)['by-code']['$post']
>['json']

export const useGetCouponByCode = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.coupons['by-code'].$post({
        json,
      })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Apply coupon successfully!')
      // queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
    onError: () => {
      toast.error('Coupon not match')
    },
  })

  return mutation
}
