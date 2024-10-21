import { UserRole } from '@/db/schema'

export type CustomUserSession = {
  id: string | undefined
  name: string
  email: string
  image: string
  role: UserRole
}
