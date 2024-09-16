import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.attachments)['$get'],
  200
>

export const useGetAttachments = (courseId?: string) => {
  const query = useQuery({
    queryKey: ['attachments', { courseId }],
    queryFn: async () => {
      const response = await client.api.attachments.$get({
        query: { courseId },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch attachments')
      }

      const { data } = await response.json()
      return data
    },
  })

  return query
}
