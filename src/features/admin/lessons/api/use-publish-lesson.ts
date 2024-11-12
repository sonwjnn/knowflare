import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.lessons)[':id']['publish']['$patch']
>

export const usePublishLesson = ({
  id,
  chapterId,
}: {
  id?: string
  chapterId?: string
}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.admin.lessons[':id']['publish'][
        '$patch'
      ]({
        param: { id },
        query: { chapterId },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Lesson published')
      queryClient.invalidateQueries({ queryKey: ['lesson', { id }] })
      queryClient.invalidateQueries({ queryKey: ['lessons', { chapterId }] })
    },
    onError: () => {
      toast.error('Failed to edit course')
    },
  })

  return mutation
}
