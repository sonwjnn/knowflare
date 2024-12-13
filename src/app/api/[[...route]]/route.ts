import authConfig from '@/auth.config'
import { AuthConfig, initAuthConfig } from '@hono/auth-js'
import { serve } from '@hono/node-server'
import { Context, Hono } from 'hono'
import { handle } from 'hono/vercel'
import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'

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
import conversations from './conversations'
import coupons from './coupons'
import courses from './courses'
import directMessages from './direct-messages'
import lessons from './lessons'
import purchases from './purchases'
import reviews from './reviews'
import subscriptions from './subscriptions'
import userProgress from './user-progress'
import users from './users'
import wishlists from './wishlists'

declare module 'hono' {
  interface ContextVariableMap {
    io: Server
  }
}

const runtime = 'nodejs'

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: c.env.AUTH_SECRET,
    ...authConfig,
  } as any
}

const app = new Hono().basePath('/api')

// Initialize auth middleware
app.use('*', initAuthConfig(getAuthConfig))

// Create HTTP server
const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  info => {
    console.log(`Server is running: http://${info.address}:${info.port}`)
  }
)

// Create Socket.IO server
const ioServer = new Server(server as HttpServer, {
  path: '/ws',
  serveClient: false,
  cors: {
    origin: '*', // Adjust this to your specific origin in production
    methods: ['GET', 'POST'],
  },
})

ioServer.on('error', err => {
  console.error('Socket.IO Server Error:', err)
})

ioServer.on('connection', socket => {
  console.log('Client connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Middleware to attach Socket.IO server to Hono context
app.use('*', (c, next) => {
  c.set('io', ioServer)
  return next()
})

// Define routes
const routes = app
  .route('/users', users)
  .route('/categories', categories)
  .route('/courses', courses)
  .route('/chapters', chapters)
  .route('/purchases', purchases)
  .route('/userProgress', userProgress)
  .route('/carts', carts)
  .route('/wishlists', wishlists)
  .route('/reviews', reviews)
  .route('/comments', comments)
  .route('/subscriptions', subscriptions)
  .route('/lessons', lessons)
  .route('/coupons', coupons)
  .route('/conversations', conversations)
  .route('/directMessages', directMessages)
  .route('/admin/courses', adminCourses)
  .route('/admin/chapters', adminChapters)
  .route('/admin/lessons', adminLessons)
  .route('/admin/analysis', adminAnalysis)
  .route('/admin/users', adminUsers)
  .route('/admin/categories', adminCategories)
  .route('/admin/coupons', adminCoupons)
  .route('/admin/backups', adminBackups)

// Export HTTP method handlers
export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
