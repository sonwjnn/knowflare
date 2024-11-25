import { CustomUserSession } from '@/types'
import NextAuth, { type DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export type ExtendedUser = DefaultSession['user'] & CustomUserSession

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends ExtendedUser {}
}

declare module '@auth/core/jwt' {
  interface JWT extends ExtendedUser {}
}
// declare module '@tanstack/table-core' {
//   interface FilterFns {
//     dateBetweenFilterFn: FilterFn<unknown>
//     statusFilterFn: FilterFn<unknown>
//   }
// }
