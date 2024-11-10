import { useCourseId } from '@/hooks/use-course-id'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.lessons)[':id']['$patch']
>
type RequestType = InferRequestType<
  (typeof client.api.admin.lessons)[':id']['$patch']
>['json']

export const useEditLesson = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.admin.lessons[':id']['$patch']({
        json,
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Lesson updated')
      queryClient.invalidateQueries({ queryKey: ['lesson', { id }] })
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
    },
    onError: () => {
      toast.error('Failed to edit lesson')
    },
  })

  return mutation
}
