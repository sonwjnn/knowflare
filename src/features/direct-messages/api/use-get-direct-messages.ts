import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.directMessages)['$get'],
  200
>

export const useGetDirectMessages = ({
  conversationId,
  cursor,
}: {
  conversationId: string
  cursor?: string
}) => {
  const query = useQuery({
    queryKey: ['direct-messages'],
    queryFn: async () => {
      const response = await client.api.directMessages.$get({
        query: {
          conversationId,
          cursor,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      const { data } = await response.json()

      return data
    },
  })

  return query
}
