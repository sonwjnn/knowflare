import { UserRole } from '@/db/schema'
import { v4 as uuidv4 } from 'uuid'

export const SEED_USERS = [
  {
    id: uuidv4(),
    name: 'admin01',
    email: `admin@gmail.com`,
    password: `$2y$12$iP/xAKD1q.L5YHiBEASuk.zn21vrb5jF0SQfLkpTE4m9fpftMyDq2`,
    emailVerified: new Date(),
    role: UserRole.ADMIN,
  },

  {
    id: uuidv4(),
    name: 'hoangsonj4f',
    email: `hoangsonj4f@gmail.com`,
    password: `$2y$12$iP/xAKD1q.L5YHiBEASuk.zn21vrb5jF0SQfLkpTE4m9fpftMyDq2`,
    emailVerified: new Date(),
    role: UserRole.USER,
  },
]
