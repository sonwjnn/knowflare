import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.chapters)['$get'],
  200
>

export const useGetChapters = (courseId?: string) => {
  const query = useQuery({
    enabled: !!courseId,
    queryKey: ['chapters', { courseId }],
    queryFn: async () => {
      const response = await client.api.chapters.$get({
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
