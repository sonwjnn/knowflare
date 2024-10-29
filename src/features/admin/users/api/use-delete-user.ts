import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.users)[':id']['$delete']
>

export const useDeleteUser = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async json => {
      const response = await client.api.users[':id']['$delete']({
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('User deleted')
      queryClient.invalidateQueries({ queryKey: ['user', { id }] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Failed to delete user')
    },
  })

  return mutation
}
