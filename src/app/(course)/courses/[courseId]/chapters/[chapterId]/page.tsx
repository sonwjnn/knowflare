import { Banner } from '@/components/banner'
import { Preview } from '@/components/preview'
import { Separator } from '@/components/ui/separator'
import { useGetChapter } from '@/features/chapters/api/use-get-chapter'
import { useGetCourse } from '@/features/courses/api/use-get-course'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useCourseId } from '@/hooks/use-course-id'
import { File } from 'lucide-react'
import { redirect } from 'next/navigation'

import { EnrollButton } from './enroll-button'
import { ProgressButton } from './progress-button'
import { VideoPlayer } from './video-player'

const ChapterIdPage = async ({
  params,
}: {
  params: {
    courseId: string
    chapterId: string
  }
}) => {
  const courseId = useCourseId()
  const chapterId = useChapterId()

  const { data: course, isPending: courseLoading } = useGetCourse(courseId)
  const { data: chapter, isPending: chapterLoading } = useGetChapter(chapterId)

  // const {
  //   chapter,
  //   course,
  //   muxData,
  //   attachments,
  //   nextChapter,
  //   userProgress,
  //   purchase,
  // } = await getchapter({
  //   userId,
  //   chapterId: params.chapterId,
  //   courseId: params.courseId,
  // })

  // const isLocked = !chapter.isFree && !purchase
  // const completeOnEnd = !!purchase && !userProgress?.isCompleted
  const isLocked = false
  const completeOnEnd = false

  return (
    <div>
      {false && (
        <Banner variant="success" label="You already completed this chapter" />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase the course to watch this chapter"
        />
      )}
      <div className="mx-auto flex max-w-4xl flex-col pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            // title={chapter.title}
            title="chapter Title"
            courseId={params.courseId}
            // nextChapterId={nextChapter?.id!}
            nextChapterId={params.chapterId}
            playbackId={''}
            isLocked={false}
            completeOnEnd={false}
          />
        </div>
        <div className="flex flex-col items-center justify-between p-4 md:flex-row">
          <h2 className="mb-2 text-2xl font-semibold">{'chapter Title'}</h2>
          {false ? (
            <ProgressButton
              chapterId={params.chapterId}
              courseId={params.courseId}
              // nextChapterId={nextChapter?.id}
              // isCompleted={!!userProgress?.isCompleted}
              nextChapterId={params.chapterId}
              isCompleted={false}
            />
          ) : (
            <EnrollButton courseId={params.courseId} price={1000} />
          )}
        </div>
        <Separator />
        <div>
          <Preview value={'chapter desc'} />
        </div>
        {!!false && (
          <>
            <Separator />
            <div>
              {/* {attachments.map(attachment => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  className="rounded-m flex w-full items-center border bg-sky-200 p-3 text-sky-700 hover:underline"
                >
                  <File />
                  <p className="line-clamp-1">{attachment.name}</p>
                </a>
              ))} */}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ChapterIdPage
