'use client'

import { Banner } from '@/components/banner'
import { IconBadge } from '@/components/icon-badge'
import { useGetChapter } from '@/features/chapters/api/use-get-chapter'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useCourseId } from '@/hooks/use-course-id'
import { useTeacherId } from '@/hooks/use-teacher-id'
import { ArrowLeft, Eye, LayoutDashboard, Loader2, Video } from 'lucide-react'
import Link from 'next/link'

import ChapterAccessForm from './access-form'
import ChapterActions from './actions'
import ChapterDescriptionForm from './description-form'
import ChapterTitleForm from './title-form'
import ChapterVideoForm from './video-form'

const ChapterIdPage = ({
  params,
}: {
  params: { chapterId: string; courseId: string }
}) => {
  const chapterId = useChapterId()
  const teacherId = useTeacherId()
  const courseId = useCourseId()

  const { data: chapter, isPending: chapterLoading } = useGetChapter(chapterId)

  if (!chapter) return null

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `${completedFields}/${totalFields}`

  const isComplete = requiredFields.every(Boolean)

  if (chapterLoading) {
    ;<div className="flex h-full items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  }

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
              href={`/teacher/${teacherId}/courses/${courseId}`}
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
                isPublished={!!chapter?.isPublished}
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
