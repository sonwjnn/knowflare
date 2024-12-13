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

export type Message = {
  id: string
  content: string | null
  createdAt: Date | null
  conversationId: string
  userId: string
  user: {
    email: string | null
    id: string
    name: string | null
    image: string | null
  }
}

export type MessageWithUser = Message & {
  user: {
    email: string | null
    id: string
    name: string | null
    image: string | null
  }
}
