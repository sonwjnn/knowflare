import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import type { AdapterAccountType } from 'next-auth/adapters'
import { z } from 'zod'

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  password: text('password'),
})

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verification_token',
  {
    email: text('email').notNull(),
    token: text('token').notNull().unique(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  verificationToken => ({
    compositePk: primaryKey({
      columns: [verificationToken.email, verificationToken.token],
    }),
  })
)

export const passwordResetTokens = pgTable(
  'password_reset_token',
  {
    email: text('email').notNull(),
    token: text('token').notNull().unique(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  passwordResetTokens => ({
    compositePk: primaryKey({
      columns: [passwordResetTokens.email, passwordResetTokens.token],
    }),
  })
)

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  authenticator => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)

export const teachers = pgTable('teacher', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
})

export const courses = pgTable('course', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  teacherId: text('teacher_id')
    .notNull()
    .references(() => teachers.id, {
      onDelete: 'cascade',
    }),
  categoryId: text('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  price: integer('price').default(0).notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  date: timestamp('date', { mode: 'date' }).notNull(),
})

export const coursesRelations = relations(courses, ({ many, one }) => ({
  category: one(categories, {
    fields: [courses.categoryId],
    references: [categories.id],
  }),
  teacher: one(teachers, {
    fields: [courses.teacherId],
    references: [teachers.id],
  }),
  chapters: many(chapters),
  attachments: many(attachments),
  purchases: many(purchases),
}))

export const insertCoursesSchema = createInsertSchema(courses, {
  date: z.coerce.date(),
})

export const categories = pgTable('category', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
})

export const attachments = pgTable('attachment', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text('course_id')
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),
  name: text('name').notNull(),
  url: text('url').notNull(),
  date: timestamp('date', { mode: 'date' }).notNull(),
})

export const attachmentsInsertSchema = createInsertSchema(attachments, {
  date: z.coerce.date(),
})

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  course: one(courses, {
    fields: [attachments.courseId],
    references: [courses.id],
  }),
}))

export const chapters = pgTable('chapter', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text('course_id')
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),
  title: text('title').notNull(),
  description: text('description'),
  videoUrl: text('video_url'),
  position: integer('position').notNull(),
  isPublished: boolean('is_published').default(false),
  isFree: boolean('is_free').default(false),
})

export const insertChaptersSchema = createInsertSchema(chapters)

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  muxData: one(muxData, {
    fields: [chapters.id],
    references: [muxData.chapterId],
  }),
  userProgress: many(userProgress),
}))

export const muxData = pgTable('mux_data', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  chapterId: text('chapter_id')
    .notNull()
    .references(() => chapters.id, {
      onDelete: 'cascade',
    }),
  assetId: text('asset_id').notNull(),
  playbackId: text('playback_id'),
})

export const muxDataRelations = relations(muxData, ({ one }) => ({
  chapter: one(chapters, {
    fields: [muxData.chapterId],
    references: [chapters.id],
  }),
}))

export const userProgress = pgTable('user_progress', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  chapterId: text('chapter_id')
    .notNull()
    .references(() => chapters.id, {
      onDelete: 'cascade',
    }),
  isCompleted: boolean('is_completed').default(false),
})

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  chapter: one(chapters, {
    fields: [userProgress.chapterId],
    references: [chapters.id],
  }),
}))

export const purchases = pgTable('purchases', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  courseId: text('course_id')
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),
})

export const purchasesRelations = relations(purchases, ({ one }) => ({
  course: one(courses, {
    fields: [purchases.courseId],
    references: [courses.id],
  }),
}))

export const subscriptions = pgTable('subscription', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  subscriptionId: text('subscriptionId').notNull(),
  customerId: text('customerId').notNull(),
  priceId: text('priceId').notNull(),
  status: text('status').notNull(),
  currentPeriodEnd: timestamp('currentPeriodEnd', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull(),
})
