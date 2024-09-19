import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.teachers)[':id']['courses']['$get'],
  200
>

export const useGetTeacherCourses = (teacherId: string) => {
  const query = useQuery({
    enabled: !!teacherId,
    queryKey: ['teachers', { teacherId }, 'courses'],
    queryFn: async () => {
      const response = await client.api.teachers[':id']['courses'].$get({
        param: {
          id: teacherId,
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
