import { useCourseId } from '@/hooks/use-course-id'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.chapters)[':id']['publish']['$patch']
>

export const usePublishChapter = (id?: string) => {
  const queryClient = useQueryClient()
  const courseId = useCourseId()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.chapters[':id']['publish']['$patch']({
        param: { id },
        query: { courseId },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Chapter published')
      queryClient.invalidateQueries({ queryKey: ['chapter', { id }] })
      queryClient.invalidateQueries({ queryKey: ['chapters', { courseId }] })
      queryClient.invalidateQueries({ queryKey: ['course', { courseId }] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
    onError: () => {
      toast.error('Failed to edit course')
    },
  })

  return mutation
}
