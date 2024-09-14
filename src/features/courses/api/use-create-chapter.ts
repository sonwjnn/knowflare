import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.courses)[':id']['chapters']['$post'],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.courses)[':id']['chapters']['$post']
>['json']

export const useCreateChapter = (courseId: string) => {
  const queryClient = useQueryClient()

  const chaptersKey = ['courses', courseId, 'chapters']

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.courses[':id']['chapters'].$post({
        json,
        param: { id: courseId },
      })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Chapter created.')
      queryClient.invalidateQueries({ queryKey: chaptersKey })
      queryClient.invalidateQueries({ queryKey: ['chapters'] })
    },
    onError: () => {
      toast.error(
        'Failed to create chapter. The session token may have expired, logout and login again, and everything will work fine.'
      )
    },
  })

  return mutation
}
