import { useCourseId } from '@/hooks/use-course-id'
import { useTeacherId } from '@/hooks/use-teacher-id'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.lessons)[':id']['$delete']
>

export const useDeleteLesson = ({
  id,
  chapterId,
}: {
  id?: string
  chapterId: string
}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async json => {
      const response = await client.api.admin.lessons[':id']['$delete']({
        param: { id },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Lesson deleted')
      queryClient.invalidateQueries({ queryKey: ['lessons', { chapterId }] })
    },
    onError: () => {
      toast.error('Failed to delete lesson')
    },
  })

  return mutation
}
