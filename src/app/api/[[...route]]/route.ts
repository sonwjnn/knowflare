import authConfig from '@/auth.config'
import { AuthConfig, initAuthConfig } from '@hono/auth-js'
import { Context, Hono } from 'hono'
import { handle } from 'hono/vercel'

import attachments from './attachments'
import carts from './carts'
import categories from './categories'
import chapters from './chapters'
import comments from './comments'
import courses from './courses'
import purchases from './purchases'
import reviews from './reviews'
import subscriptions from './subscriptions'
import teachers from './teachers'
import userProgress from './user-progress'
import users from './users'
import wishlists from './wishlists'

const runtime = 'nodejs'

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: c.env.AUTH_SECRET,
    ...authConfig,
  }
}

const app = new Hono().basePath('/api')

app.use('*', initAuthConfig(getAuthConfig))

const routes = app
  .route('/users', users)
  .route('/categories', categories)
  .route('/courses', courses)
  .route('/chapters', chapters)
  // .route('/attachments', attachments)
  .route('/purchases', purchases)
  // .route('/teachers', teachers)
  // .route('/userProgress', userProgress)
  .route('/carts', carts)
  .route('/wishlists', wishlists)
  .route('/reviews', reviews)
  .route('/comments', comments)
  .route('/subscriptions', subscriptions)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
