import { useCourseId } from '@/hooks/use-course-id'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.chapters)[':id']['$patch']
>
type RequestType = InferRequestType<
  (typeof client.api.admin.chapters)[':id']['$patch']
>['json']

export const useEditChapter = (id?: string) => {
  const queryClient = useQueryClient()
  const courseId = useCourseId()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.admin.chapters[':id']['$patch']({
        json,
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Chapter updated')
      queryClient.invalidateQueries({ queryKey: ['chapter', { id }] })
      queryClient.invalidateQueries({ queryKey: ['chapters', { courseId }] })
      queryClient.invalidateQueries({ queryKey: ['course', { courseId }] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
    onError: () => {
      toast.error('Failed to edit chapter')
    },
  })

  return mutation
}
