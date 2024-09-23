import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { useSession } from 'next-auth/react'

export type ResponseType = InferResponseType<
  (typeof client.api.userProgress)[':userId'][':courseId']['$get'],
  200
>

export const useGetUserProgress = (courseId?: string) => {
  const session = useSession()
  const userId = session?.data?.user?.id

  const query = useQuery({
    enabled: !!courseId,
    queryKey: ['progress', { courseId }],
    queryFn: async () => {
      const response = await client.api.userProgress[':userId'][
        ':courseId'
      ].$get({
        param: {
          userId,
          courseId,
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
