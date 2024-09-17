import { useCourseId } from '@/hooks/use-course-id'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.chapters)[':id']['$delete']
>

export const useDeleteChapter = (id?: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const courseId = useCourseId()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async json => {
      const response = await client.api.chapters[':id']['$delete']({
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Chapter deleted')
      router.replace(`/teacher/courses/${courseId}`)
      queryClient.invalidateQueries({ queryKey: ['chapter', { id }] })
      queryClient.invalidateQueries({ queryKey: ['chapters', { courseId }] })
      queryClient.invalidateQueries({ queryKey: ['course', { courseId }] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
    onError: () => {
      toast.error('Failed to delete chapter')
    },
  })

  return mutation
}
