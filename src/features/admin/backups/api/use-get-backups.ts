import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.admin.backups)['$get'],
  200
>

export const useGetBackups = () => {
  const query = useQuery({
    queryKey: ['backups'],
    queryFn: async () => {
      const response = await client.api.admin.backups.$get()

      if (!response.ok) {
        throw new Error('Failed to fetch backups')
      }

      const { data } = await response.json()
      return data
    },
  })

  return query
}
