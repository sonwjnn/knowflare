import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.users)[':id']['$get'],
  200
>

export const useGetUser = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['user', { id }],
    queryFn: async () => {
      const response = await client.api.users[':id'].$get({
        param: {
          id: id,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
