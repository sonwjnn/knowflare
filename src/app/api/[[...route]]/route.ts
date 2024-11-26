import authConfig from '@/auth.config'
import { AuthConfig, initAuthConfig } from '@hono/auth-js'
import { Context, Hono } from 'hono'
import { handle } from 'hono/vercel'
import { AdapterUser } from 'next-auth/adapters'

import adminAnalysis from './admin/analysis'
import adminBackups from './admin/backups'
import adminCategories from './admin/categories'
import adminChapters from './admin/chapters'
import adminCoupons from './admin/coupons'
import adminCourses from './admin/courses'
import adminLessons from './admin/lessons'
import adminUsers from './admin/users'
import attachments from './attachments'
import carts from './carts'
import categories from './categories'
import chapters from './chapters'
import comments from './comments'
import coupons from './coupons'
import courses from './courses'
import lessons from './lessons'
import purchases from './purchases'
import reviews from './reviews'
import subscriptions from './subscriptions'
import userProgress from './user-progress'
import users from './users'
import wishlists from './wishlists'

const runtime = 'edge'

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: c.env.AUTH_SECRET,
    ...authConfig,
  } as any
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
  .route('/userProgress', userProgress)
  .route('/carts', carts)
  .route('/wishlists', wishlists)
  .route('/reviews', reviews)
  .route('/comments', comments)
  .route('/subscriptions', subscriptions)
  .route('/lessons', lessons)
  .route('/coupons', coupons)
  .route('/admin/courses', adminCourses)
  .route('/admin/chapters', adminChapters)
  .route('/admin/lessons', adminLessons)
  .route('/admin/analysis', adminAnalysis)
  .route('/admin/users', adminUsers)
  .route('/admin/categories', adminCategories)
  .route('/admin/coupons', adminCoupons)
  .route('/admin/backups', adminBackups)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
