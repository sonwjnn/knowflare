import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.admin.analysis)['overview']['$get'],
  200
>

export const useGetOverviewAnalysis = () => {
  const query = useQuery({
    queryKey: ['analysis', 'overview'],
    queryFn: async () => {
      const response = await client.api.admin.analysis['overview'].$get()

      if (!response.ok) {
        throw new Error('Failed to fetch analysis overview')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
