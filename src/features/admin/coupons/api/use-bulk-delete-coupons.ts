import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.coupons)['bulk-delete']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.admin.coupons)['bulk-delete']['$post']
>['json']

export const useBulkDeleteCoupons = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.admin.coupons['bulk-delete']['$post']({
        json,
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Coupon deleted')
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
    },
    onError: () => {
      toast.error('Failed to delete coupons')
    },
  })

  return mutation
}
