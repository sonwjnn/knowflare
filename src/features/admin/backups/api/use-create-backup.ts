import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.backups)['$post'],
  200
>

export const useCreateBackup = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async json => {
      const response = await client.api.admin.backups.$post()

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      return await response.json()
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['backups'] })
    },
    onError: () => {
      toast.error('Failed to create backup. ')
    },
  })

  return mutation
}
