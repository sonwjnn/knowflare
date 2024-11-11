import { auth } from '@/auth'
import { isTeacher } from '@/lib/utils'
import { type FileRouter, createUploadthing } from 'uploadthing/next'

const f = createUploadthing()

const handleAuth = async () => {
  const session = await auth()

  const userId = session?.user?.id

  if (!userId) throw new Error('Unauthorized')
  return { userId }
}

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  courseAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  lessonVideo: f({ video: { maxFileSize: '512GB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
