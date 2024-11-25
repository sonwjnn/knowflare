import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.admin.backups)[':id']['$get'],
  200
>

export const useGetBackup = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['backup', { id }],
    queryFn: async () => {
      const response = await client.api.admin.backups[':id'].$get({
        param: {
          id: id ?? '',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch backup')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
