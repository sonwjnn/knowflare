import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.teachers)[':id']['$get'],
  200
>

export const useGetTeacher = (id: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['teacher', { id }],
    queryFn: async () => {
      const response = await client.api.teachers[':id'].$get({
        param: {
          id,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch teacher')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
