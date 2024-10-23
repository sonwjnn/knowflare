import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.lessons)[':id']['$get'],
  200
>

export const useGetLesson = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['lesson', { id }],
    queryFn: async () => {
      const response = await client.api.lessons[':id'].$get({
        param: {
          id: id,
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
