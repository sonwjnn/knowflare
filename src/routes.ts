/**
 * An array of routes that are public.
 * These routes do not require authentication.
 * @type {string[]}
 */

export const publicRoutes = [
  '/',
  '/about',
  '/blog',
  '/auth-signin/google',
  '/auth-signin/github',
] as string[]

/**
 * An array of routes that are used for authentication .
 * These routes will redirect logged in users to /settings.
 * @type {string[]}
 */
export const authRoutes = [
  '/sign-in',
  '/sign-up',
  '/error',
  '/reset',
  '/new-password',
  '/new-verification',
]

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth'

/**
 * The prefix for API webhooks routes.
 * Routes that start with this prefix are used for API webhooks purposes.
 * @type {string}
 */
export const apiWebhooksPrefix = '/api/webhooks'

/**
 * The default redirect path after logging in.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/'
