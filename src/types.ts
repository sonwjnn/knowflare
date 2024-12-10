import { UserRole } from '@/db/schema'

export type CustomUserSession = {
  id: string | undefined
  name: string
  email: string
  image: string
  bio: string
  fullName: string
  role: UserRole
  isTwoFactorEnabled: boolean
  isOAuth: boolean
}
