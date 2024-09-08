import AuthConfig from '@/auth.config'
import NextAuth from 'next-auth'

export const { handlers, signIn, signOut, auth } = NextAuth(AuthConfig)
