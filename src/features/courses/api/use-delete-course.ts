import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.courses)[':id']['$delete']
>

export const useDeleteCourse = (id?: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async json => {
      const response = await client.api.courses[':id']['$delete']({
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Course deleted')
      router.push('/teacher/courses')
      queryClient.invalidateQueries({ queryKey: ['course', { id }] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
    onError: () => {
      toast.error('Failed to delete course')
    },
  })

  return mutation
}
