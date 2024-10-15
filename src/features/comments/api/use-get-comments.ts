import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.comments)['$get'],
  200
>

export const useGetComments = (courseId: string) => {
  const query = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      const response = await client.api.comments.$get({
        query: {
          courseId,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch comment')
      }
      const { data } = await response.json()

      return data
    },
  })

  return query
}
