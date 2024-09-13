import { Banner } from '@/components/banner'
import { IconBadge } from '@/components/icon-badge'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import ChapterAccessForm from './chapter-access-form'
import ChapterActions from './chapter-actions'
import ChapterDescriptionForm from './chapter-description-form'
import ChapterTitleForm from './chapter-title-form'
import ChapterVideoForm from './chapter-video-form'

const ChapterIdPage = async ({
  params,
}: {
  params: { chapterId: string; courseId: string }
}) => {
  const { courseId, chapterId } = params
  const { userId } = auth()

  if (!userId) return redirect('/')

  const chapter = await db.chapter.findUnique({
    where: { id: chapterId, courseId },
    include: {
      muxData: true,
    },
  })
  if (!chapter) return redirect('/')

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `${completedFields}/${totalFields}`

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      {!chapter?.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is not published yet. it will not be visible in the course"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${courseId}`}
              className="mb-6 flex items-center text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to course setup
            </Link>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-x-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter?.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <ChapterVideoForm
              initialData={chapter}
              chapterId={chapterId}
              courseId={courseId}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ChapterIdPage
