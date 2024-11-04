import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.chapters)[':id']['$get'],
  200
>

export const useGetChapter = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['chapter', { id }],
    queryFn: async () => {
      const response = await client.api.chapters[':id'].$get({
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
