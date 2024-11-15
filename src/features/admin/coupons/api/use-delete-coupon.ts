import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.coupons)[':id']['$delete']
>

export const useDeleteCoupon = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async json => {
      const response = await client.api.admin.coupons[':id']['$delete']({
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Coupon deleted')
      queryClient.invalidateQueries({ queryKey: ['coupon', { id }] })
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
    },
    onError: () => {
      toast.error('Failed to delete coupon')
    },
  })

  return mutation
}
