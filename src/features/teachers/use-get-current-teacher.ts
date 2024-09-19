import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { useSession } from 'next-auth/react'

export type ResponseType = InferResponseType<
  (typeof client.api.teachers)['by-user'][':userId']['$get'],
  200
>

export const useGetCurrentTeacher = () => {
  const session = useSession()
  const userId = session?.data?.user?.id

  const query = useQuery({
    enabled: !!userId,
    queryKey: ['teacher', { userId }],
    queryFn: async () => {
      const response = await client.api.teachers['by-user'][':userId'].$get({
        param: {
          userId,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch teacher')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}
