import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.chapters)[':id']['next']['$get'],
  200
>

export const useGetNextChapter = ({
  chapterId,
  courseId,
}: {
  chapterId: string
  courseId: string
}) => {
  const query = useQuery({
    enabled: !!chapterId || !!courseId,
    queryKey: ['next-chapter', { chapterId }, { courseId }],
    queryFn: async () => {
      const response = await client.api.chapters[':id']['next'].$get({
        param: {
          id: chapterId,
        },
        query: { courseId },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch course')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
