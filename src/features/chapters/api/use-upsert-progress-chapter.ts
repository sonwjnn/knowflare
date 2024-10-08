import { useCourseId } from '@/hooks/use-course-id'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.chapters)[':id']['progress']['$put']
>

type RequestType = InferRequestType<
  (typeof client.api.chapters)[':id']['progress']['$put']
>['json']

export const useUpsertProgressChapter = (id: string) => {
  const queryClient = useQueryClient()
  const courseId = useCourseId()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.chapters[':id']['progress']['$put']({
        param: { id },
        json,
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Chapter progress updated')
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
