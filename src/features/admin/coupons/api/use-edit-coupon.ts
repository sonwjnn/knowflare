import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.coupons)[':id']['$patch']
>
type RequestType = InferRequestType<
  (typeof client.api.admin.coupons)[':id']['$patch']
>['json']

export const useEditCoupon = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.admin.coupons[':id']['$patch']({
        json,
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Coupon updated')
      queryClient.invalidateQueries({ queryKey: ['coupon', { id }] })
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
    },
    onError: () => {
      toast.error('Failed to edit coupon')
    },
  })

  return mutation
}
