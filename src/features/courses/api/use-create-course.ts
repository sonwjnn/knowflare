import { useTeacherId } from '@/hooks/use-teacher-id'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.courses)['$post'], 200>
type RequestType = InferRequestType<
  (typeof client.api.courses)['$post']
>['json']

export const useCreateCourse = () => {
  const queryClient = useQueryClient()
  const teacherId = useTeacherId()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.courses.$post({ json })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Course created.')

      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({
        queryKey: ['teachers', { teacherId }, 'courses'],
      })
      queryClient.invalidateQueries({ queryKey: ['purchases', 'courses'] })
    },
    onError: () => {
      toast.error(
        'Failed to create course. The session token may have expired, logout and login again, and everything will work fine.'
      )
    },
  })

  return mutation
}
