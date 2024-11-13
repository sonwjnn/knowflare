import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.admin.analysis)['courses']['$get'],
  200
>

export const useGetCourseAnalysis = () => {
  const query = useQuery({
    queryKey: ['analysis'],
    queryFn: async () => {
      const response = await client.api.admin.analysis['courses'].$get()

      if (!response.ok) {
        throw new Error('Failed to fetch analysis')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
