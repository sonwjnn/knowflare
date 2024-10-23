import { useTeacherId } from '@/hooks/use-teacher-id'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.carts)['$post'], 200>
type RequestType = InferRequestType<(typeof client.api.carts)['$post']>['json']

export const useCreateCart = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.carts.$post({ json })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      return await response.json()
    },
    onSuccess: data => {
      toast.success('Added cart.')

      queryClient.invalidateQueries({ queryKey: ['carts'] })
    },
    onError: () => {
      toast.error('Failed to create cart. ')
    },
  })

  return mutation
}
