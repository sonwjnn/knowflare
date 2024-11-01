import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.courses)[':id']['$patch']
>
type RequestType = InferRequestType<
  (typeof client.api.admin.courses)[':id']['$patch']
>['json']

export const useEditCourse = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.admin.courses[':id']['$patch']({
        json,
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Course updated')
      queryClient.invalidateQueries({ queryKey: ['course', { id }] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
    onError: () => {
      toast.error('Failed to edit course')
    },
  })

  return mutation
}
