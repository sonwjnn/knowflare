import { db } from '@/db/drizzle'
import {
  chapters,
  courses,
  insertChaptersSchema,
  muxData,
  userProgress,
} from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import Mux from '@mux/mux-node'
import { and, asc, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const { video } = new Mux({
  tokenId: process.env['MUX_TOKEN_ID'], // This is the default and can be omitted
  tokenSecret: process.env['MUX_TOKEN_SECRET'], // This is the default and can be omitted
})

const app = new Hono().get(
  '/',
  verifyAuth(),
  zValidator(
    'query',
    z.object({
      courseId: z.string().optional(),
    })
  ),
  async c => {
    const auth = c.get('authUser')

    if (!auth.token?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { courseId } = c.req.valid('query')

    if (!courseId) {
      return c.json({ error: 'Missing id' }, 400)
    }

    const data = await db
      .select()
      .from(chapters)
      .where(eq(chapters.courseId, courseId))
      .orderBy(asc(chapters.position))

    return c.json({
      data,
    })
  }
)
// .get(
//   '/published/list',
//   verifyAuth(),
//   zValidator(
//     'query',
//     z.object({
//       courseId: z.string().optional(),
//     })
//   ),
//   async c => {
//     const auth = c.get('authUser')

//     if (!auth.token?.id) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const { courseId } = c.req.valid('query')

//     if (!courseId) {
//       return c.json({ error: 'Missing id' }, 400)
//     }

//     const data = await db
//       .select()
//       .from(chapters)
//       .where(
//         and(eq(chapters.courseId, courseId), eq(chapters.isPublished, true))
//       )
//       .orderBy(asc(chapters.position))

//     return c.json({
//       data,
//     })
//   }
// )
// .post(
//   '/',
//   verifyAuth(),
//   zValidator(
//     'json',
//     insertChaptersSchema.pick({
//       courseId: true,
//       title: true,
//     })
//   ),
//   async c => {
//     const auth = c.get('authUser')

//     if (!auth.token?.id) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const { title, courseId } = c.req.valid('json')

//     const [lastChapter] = await db
//       .select({
//         position: chapters.position,
//       })
//       .from(chapters)
//       .where(eq(chapters.courseId, courseId))
//       .orderBy(desc(chapters.position))
//       .limit(1)

//     const newPosition = lastChapter ? lastChapter.position + 1 : 1

//     const [data] = await db
//       .insert(chapters)
//       .values({
//         courseId,
//         title,
//         position: newPosition,
//       })
//       .returning()

//     if (!data) {
//       return c.json({ error: 'Something went wrong' }, 400)
//     }

//     return c.json({
//       data,
//     })
//   }
// )
// .post(
//   '/reorder',
//   verifyAuth(),
//   zValidator(
//     'json',
//     z.object({
//       list: z.array(
//         z.object({
//           id: z.string(),
//           position: z.number(),
//         })
//       ),
//     })
//   ),
//   async c => {
//     const auth = c.get('authUser')

//     if (!auth.token?.id) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const { list } = c.req.valid('json')

//     const data = []

//     for (let item of list) {
//       const [updatedChapter] = await db
//         .update(chapters)
//         .set({ position: item.position })
//         .where(eq(chapters.id, item.id))
//         .returning()

//       data.push(updatedChapter)
//     }

//     const dataOrder = data.sort((a, b) => a.position - b.position)

//     return c.json({ dataOrder })
//   }
// )
// .get(
//   '/:id',
//   verifyAuth(),
//   zValidator(
//     'param',
//     z.object({
//       id: z.string().optional(),
//     })
//   ),
//   async c => {
//     const auth = c.get('authUser')

//     if (!auth.token?.id) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const { id } = c.req.valid('param')

//     if (!id) {
//       return c.json({ error: 'Missing id' }, 400)
//     }

//     const [chapter] = await db
//       .select()
//       .from(chapters)
//       .where(eq(chapters.id, id))

//     if (!chapter) {
//       return c.json({ error: 'Chapter not found' }, 404)
//     }

//     const [muxDataResponse] = await db
//       .select()
//       .from(muxData)
//       .where(eq(muxData.chapterId, id))

//     return c.json({
//       data: {
//         ...chapter,
//         muxData: muxDataResponse,
//       },
//     })
//   }
// )
// .get(
//   '/:id/next',
//   verifyAuth(),
//   zValidator(
//     'param',
//     z.object({
//       id: z.string().optional(),
//     })
//   ),
//   zValidator(
//     'query',
//     z.object({
//       courseId: z.string().optional(),
//     })
//   ),
//   async c => {
//     const auth = c.get('authUser')

//     if (!auth.token?.id) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const { id } = c.req.valid('param')
//     const { courseId } = c.req.valid('query')

//     if (!id || !courseId) {
//       return c.json({ error: 'Missing id' }, 400)
//     }

//     const [chapter] = await db
//       .select()
//       .from(chapters)
//       .where(eq(chapters.id, id))

//     if (!chapter) {
//       return c.json({ error: 'Chapter not found' }, 404)
//     }

//     // const [] = await db.select().from(chapters).where()

//     const [muxDataResponse] = await db
//       .select()
//       .from(muxData)
//       .where(eq(muxData.chapterId, id))

//     return c.json({
//       data: {
//         ...chapter,
//         muxData: muxDataResponse,
//       },
//     })
//   }
// )

// .patch(
//   '/:id',
//   verifyAuth(),
//   zValidator(
//     'param',
//     z.object({
//       id: z.string().optional(),
//     })
//   ),
//   zValidator(
//     'json',
//     z.object({
//       title: z.string().optional(),
//       description: z.string().optional().nullable(),
//       videoUrl: z.string().optional().nullable(),
//       isPublished: z.boolean().optional(),
//       isFree: z.boolean().optional(),
//     })
//   ),
//   async c => {
//     const auth = c.get('authUser')

//     if (!auth.token?.id) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const { id } = c.req.valid('param')
//     const values = c.req.valid('json')

//     if (!id) {
//       return c.json({ error: 'Missing id' }, 400)
//     }

//     const [data] = await db
//       .update(chapters)
//       .set(values)
//       .where(eq(chapters.id, id))
//       .returning()

//     if (values?.videoUrl) {
//       const [existingMuxData] = await db
//         .select()
//         .from(muxData)
//         .where(eq(muxData.chapterId, id))

//       if (existingMuxData) {
//         await video.assets.delete(existingMuxData.assetId)
//         await db.delete(muxData).where(eq(muxData.id, existingMuxData.id))
//       }

//       const asset = await video.assets.create({
//         input: [{ url: values.videoUrl }],
//         playback_policy: ['public'],
//         test: false,
//       })

//       await db.insert(muxData).values({
//         assetId: asset.id,
//         chapterId: id,
//         playbackId: asset.playback_ids?.[0]?.id,
//       })
//     }

//     if (!data) {
//       return c.json({ error: 'Not found' }, 404)
//     }

//     return c.json({ data })
//   }
// )
// .patch(
//   '/:id/publish',
//   verifyAuth(),
//   zValidator(
//     'param',
//     z.object({
//       id: z.string().optional(),
//     })
//   ),
//   zValidator(
//     'query',
//     z.object({
//       courseId: z.string().optional(),
//     })
//   ),
//   async c => {
//     const auth = c.get('authUser')

//     if (!auth.token?.id) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const [currentTeacher] = await db
//       .select({ id: teachers.id })
//       .from(teachers)
//       .where(eq(teachers.userId, auth.token.id))

//     if (!currentTeacher) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const { id } = c.req.valid('param')
//     const { courseId } = c.req.valid('query')

//     if (!id || !courseId) {
//       return c.json({ error: 'Missing id' }, 400)
//     }

//     const [course] = await db
//       .select()
//       .from(courses)
//       .where(
//         and(
//           eq(courses.teacherId, currentTeacher.id),
//           eq(courses.id, courseId)
//         )
//       )

//     if (!course) {
//       return c.json({ error: 'Not found' }, 404)
//     }

//     const [chapter] = await db
//       .select()
//       .from(chapters)
//       .where(and(eq(chapters.courseId, course.id), eq(chapters.id, id)))

//     const muxDataResponse = await db
//       .select()
//       .from(muxData)
//       .where(eq(muxData.chapterId, id))

//     if (
//       !chapter ||
//       !muxDataResponse ||
//       !chapter.title ||
//       !chapter.description ||
//       !chapter.videoUrl
//     ) {
//       return c.json({ error: 'Missing required fields!' }, 400)
//     }

//     const [data] = await db
//       .update(chapters)
//       .set({ isPublished: true })
//       .where(eq(chapters.id, id))
//       .returning()

//     if (!data) {
//       return c.json({ error: 'Not found' }, 404)
//     }

//     return c.json({ data })
//   }
// )

// .patch(
//   '/:id/unpublish',
//   verifyAuth(),
//   zValidator(
//     'param',
//     z.object({
//       id: z.string().optional(),
//     })
//   ),
//   zValidator(
//     'query',
//     z.object({
//       courseId: z.string().optional(),
//     })
//   ),
//   async c => {
//     const auth = c.get('authUser')

//     if (!auth.token?.id) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const [currentTeacher] = await db
//       .select({ id: teachers.id })
//       .from(teachers)
//       .where(eq(teachers.userId, auth.token.id))

//     if (!currentTeacher) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const { id } = c.req.valid('param')

//     const { courseId } = c.req.valid('query')

//     if (!id || !courseId) {
//       return c.json({ error: 'Missing id' }, 400)
//     }

//     const [course] = await db
//       .select()
//       .from(courses)
//       .where(
//         and(
//           eq(courses.teacherId, currentTeacher.id),
//           eq(courses.id, courseId)
//         )
//       )

//     if (!course) {
//       return c.json({ error: 'Not found' }, 404)
//     }

//     const [data] = await db
//       .update(chapters)
//       .set({ isPublished: false })
//       .where(eq(chapters.id, id))
//       .returning()

//     const publishedChaptersInCourse = await db
//       .select()
//       .from(chapters)
//       .where(
//         and(eq(chapters.courseId, course.id), eq(chapters.isPublished, true))
//       )

//     if (!publishedChaptersInCourse.length) {
//       await db
//         .update(courses)
//         .set({ isPublished: false })
//         .where(eq(courses.id, course.id))
//     }

//     return c.json({ data })
//   }
// )
// .put(
//   '/:id/progress',
//   verifyAuth(),
//   zValidator(
//     'param',
//     z.object({
//       id: z.string().optional(),
//     })
//   ),
//   zValidator(
//     'json',
//     z.object({
//       isCompleted: z.boolean(),
//     })
//   ),
//   async c => {
//     const auth = c.get('authUser')

//     if (!auth.token?.id) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const { id } = c.req.valid('param')
//     const { isCompleted } = c.req.valid('json')

//     if (!id) {
//       return c.json({ error: 'Missing id' }, 400)
//     }

//     let data

//     data = await db
//       .update(userProgress)
//       .set({ isCompleted: true })
//       .where(
//         and(
//           eq(userProgress.chapterId, id),
//           eq(userProgress.userId, auth.token.id)
//         )
//       )
//       .returning()

//     if (!data[0]) {
//       data = await db
//         .insert(userProgress)
//         .values({
//           userId: auth.token.id,
//           chapterId: id,
//           isCompleted,
//         })
//         .returning()
//     }

//     return c.json({ data: data[0] })
//   }
// )
// .delete(
//   '/:id',
//   verifyAuth(),
//   zValidator(
//     'param',
//     z.object({
//       id: z.string().optional(),
//     })
//   ),
//   async c => {
//     const auth = c.get('authUser')

//     if (!auth.token?.id) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const { id } = c.req.valid('param')

//     if (!id) {
//       return c.json({ error: 'Missing id' }, 400)
//     }

//     const [chapter] = await db
//       .select()
//       .from(chapters)
//       .where(eq(chapters.id, id))

//     if (!chapter) {
//       return c.json({ error: 'Not found' }, 404)
//     }

//     if (chapter.videoUrl) {
//       const [existingMuxData] = await db
//         .select()
//         .from(muxData)
//         .where(eq(muxData.chapterId, id))

//       if (existingMuxData) {
//         await video.assets.delete(existingMuxData.assetId)

//         await db.delete(muxData).where(eq(muxData.id, existingMuxData.id))
//       }
//     }

//     const [deletedChapter] = await db
//       .delete(chapters)
//       .where(eq(chapters.id, id))
//       .returning({
//         id: chapters.id,
//         courseId: chapters.courseId,
//       })

//     const publishedChaptersInCourse = await db
//       .select()
//       .from(chapters)
//       .where(
//         and(
//           eq(chapters.courseId, deletedChapter.courseId),
//           eq(chapters.isPublished, true)
//         )
//       )

//     if (!publishedChaptersInCourse.length) {
//       await db
//         .update(courses)
//         .set({ isPublished: false })
//         .where(eq(courses.id, deletedChapter.courseId))
//     }

//     return c.json({ data: deletedChapter })
//   }
// )

export default app
