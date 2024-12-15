// import { client } from '@/lib/hono'
// import { useQuery } from '@tanstack/react-query'
// import { InferResponseType } from 'hono'

// export type ResponseType = InferResponseType<
//   (typeof client.api.users)['priority-admin']['info']['first']['$get'],
//   200
// >

// export const useGetAdminId = () => {
//   const query = useQuery({
//     queryKey: ['priority-admin'],
//     queryFn: async () => {
//       const response =
//         await client.api.users['priority-admin']['info']['first'].$get()

//       if (!response.ok) {
//         throw new Error('Failed to fetch priority admin')
//       }

//       const { data } = await response.json()

//       return data
//     },
//   })

//   return query
// }
