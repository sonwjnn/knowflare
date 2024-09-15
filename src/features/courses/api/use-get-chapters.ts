import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.courses)[':id']['chapters']['$get'],
  200
>

export const useGetChapters = (courseId?: string) => {
  const query = useQuery({
    enabled: !!courseId,
    queryKey: ['courses', courseId, 'chapters'],
    queryFn: async () => {
      const response = await client.api.courses[':id']['chapters'].$get({
        param: { id: courseId },
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
