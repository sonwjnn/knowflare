import { CourseLevel } from '@/db/schema'
import { client } from '@/lib/hono'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

export type ResponseType = InferResponseType<
  (typeof client.api.courses)['list']['top-courses-last-three-week']['$get'],
  200
>

export const useGetTopCourses = () => {
  const query = useQuery({
    queryKey: ['top-courses'],
    queryFn: async () => {
      const response =
        await client.api.courses['list']['top-courses-last-three-week'].$get()

      if (!response.ok) {
        throw new Error('Failed to fetch course')
      }
      const { data } = await response.json()

      return data
    },
  })

  return query
}
