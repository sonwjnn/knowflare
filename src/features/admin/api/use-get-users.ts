import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.users)['$get'],
  200
>

export const useGetUsers = () => {
  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await client.api.users.$get()

      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }
      const { data } = await response.json()

      return data
    },
  })

  return query
}
