import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.users)[':id']['$patch']
>
type RequestType = InferRequestType<
  (typeof client.api.admin.users)[':id']['$patch']
>['json']

export const useEditUser = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.admin.users[':id']['$patch']({
        json,
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('User updated')
      queryClient.invalidateQueries({ queryKey: ['user', { id }] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Failed to edit user')
    },
  })

  return mutation
}
