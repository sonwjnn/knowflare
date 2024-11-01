import { useTeacherId } from '@/hooks/use-teacher-id'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.categories)['$post'],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.categories)['$post']
>['json']

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.categories.$post({ json })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      return await response.json()
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: () => {
      toast.error('Failed to create category. ')
    },
  })

  return mutation
}
