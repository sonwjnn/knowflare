import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.admin.users)['list']['have-course']['$get'],
  200
>

export const useGetUsersHaveCourse = () => {
  const query = useQuery({
    queryKey: ['users', 'have-courses'],
    queryFn: async () => {
      const response =
        await client.api.admin.users['list']['have-course'].$get()

      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
