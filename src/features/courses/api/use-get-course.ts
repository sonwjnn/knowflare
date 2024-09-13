import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.courses)[':id']['$get'],
  200
>

export const useGetCourse = (id: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['course', { id }],
    queryFn: async () => {
      const response = await client.api.courses[':id'].$get({
        param: {
          id,
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
