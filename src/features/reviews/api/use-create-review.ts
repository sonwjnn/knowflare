import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.reviews)['$post'], 200>
type RequestType = InferRequestType<
  (typeof client.api.reviews)['$post']
>['json']

export const useCreateReview = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.reviews.$post({ json })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Reviews created.')

      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
    onError: () => {
      toast.error('Failed to create reviews.')
    },
  })

  return mutation
}
