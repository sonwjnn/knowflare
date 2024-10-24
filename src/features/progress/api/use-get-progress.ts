import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.userProgress)[':lessonId']['$get'],
  200
>

export const useGetUserProgress = (lessonId?: string) => {
  const query = useQuery({
    enabled: !!lessonId,
    queryKey: ['progress', { lessonId }],
    queryFn: async () => {
      const response = await client.api.userProgress[':lessonId'].$get({
        param: {
          lessonId,
        },
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
