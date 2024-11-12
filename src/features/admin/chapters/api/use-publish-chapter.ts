import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.admin.chapters)[':id']['publish']['$patch']
>

export const usePublishChapter = ({
  id,
  courseId,
}: {
  id?: string
  courseId?: string
}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.admin.chapters[':id']['publish'][
        '$patch'
      ]({
        param: { id },
        query: { courseId },
      })

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Chapter published')
      queryClient.invalidateQueries({ queryKey: ['chapter', { id }] })
      queryClient.invalidateQueries({ queryKey: ['chapters', { courseId }] })
    },
    onError: () => {
      toast.error('Failed to edit course')
    },
  })

  return mutation
}
