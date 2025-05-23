import { client } from '@/lib/hono'
import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { signIn } from 'next-auth/react'

type ResponseType = InferResponseType<
  (typeof client.api.users)['login']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.users)['login']['$post']
>['json']

export const useSignIn = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.users['login'].$post({ json })

      if (!response.ok) {
        const data = await response.json()
        if ('error' in data) {
          throw new Error(data.error)
        }
        throw new Error('Something went wrong')
      }

      return await response.json()
    },
  })

  return mutation
}
