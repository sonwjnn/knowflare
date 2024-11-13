import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { useSearchParams } from 'next/navigation'

export type ResponseType = InferResponseType<
  (typeof client.api.admin.analysis)['monthly']['$get'],
  200
>

export const useGetMonthlyAnalysis = () => {
  const params = useSearchParams()
  const from = params.get('from') || ''
  const to = params.get('to') || ''
  // const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ['analysis', { from, to }],
    queryFn: async () => {
      const response = await client.api.admin.analysis['monthly'].$get({
        query: {
          from,
          to,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch analysis')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
