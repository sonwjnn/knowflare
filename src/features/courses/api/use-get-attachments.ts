import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.courses)[':id']['attachments']['$get'],
  200
>

export const useGetAttachments = (courseId?: string) => {
  const query = useQuery({
    enabled: !!courseId,
    queryKey: ['courses', courseId, 'attachments'],
    queryFn: async () => {
      const response = await client.api.courses[':id']['attachments'].$get({
        param: { id: courseId },
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
