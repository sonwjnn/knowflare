'use client'

import { Banner } from '@/components/banner'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LessonType } from '@/db/schema'
import { useCommentsSheet } from '@/features/comments/store/use-comments-sheet'
import { useGetLesson } from '@/features/lessons/api/use-get-lesson'
import { useGetUserProgress } from '@/features/progress/api/use-get-progress'
import { useGetCurrentPurchase } from '@/features/purchases/api/use-get-current-purchases'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useCourseId } from '@/hooks/use-course-id'
import { useLessonId } from '@/hooks/use-lesson-id'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Loader2, Lock } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useMedia } from 'react-use'

import { ProgressButton } from './progress-button'
import QuizComponent from './quiz'

const ReactPlayerYoutube = dynamic(() => import('react-player/youtube'), {
  ssr: false,
})
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
})

export default function CourseInterface() {
  const isMobile = useMedia('(max-width: 1024px)', false)
  const courseId = useCourseId()
  const lessonId = useLessonId()

  const router = useRouter()

  const { data: purchase, isPending: purchaseLoading } =
    useGetCurrentPurchase(courseId)
  const { data: lesson, isPending: lessonLoading } = useGetLesson({
    lessonId,
    courseId,
  })
  const { data: userLessonProgress, isPending: userLessonProgressLoading } =
    useGetUserProgress(lessonId)
  const [open, setOpen] = useCommentsSheet()

  const isLocked = !lesson?.isFree && !purchase

  if (lessonLoading) {
    return (
      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 pr-2">
      <div className="relative mx-auto w-full">
        {/* {isLocked && (
          <Banner
            variant="warning"
            label="You need to purchase the course to watch this chapter"
          />
        )} */}

        {lesson?.lessonType === LessonType.VIDEO && (
          <div className="mb-6 rounded-none bg-black">
            <div className="relative mx-auto aspect-video max-h-[80dvh]">
              {/* {!isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
              )} */}
              {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
                  <Lock className="h-8 w-8" />
                  <p className="text-sm">This lesson is locked</p>
                </div>
              )}
              {!isLocked && (
                <>
                  {lesson?.videoUrl?.includes('youtube.com') ? (
                    <ReactPlayerYoutube
                      url={lesson?.videoUrl || ''}
                      width="100%"
                      height="100%"
                      controls
                    />
                  ) : (
                    <ReactPlayer
                      url={lesson?.videoUrl || ''}
                      width="100%"
                      height="100%"
                      controls
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {lesson?.lessonType === LessonType.QUIZ && <QuizComponent />}
        <div className="px-8">
          <div className="mb-6 flex">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{lesson?.title}</h2>
              <p className="text-gray-600">Updated 2 months ago</p>
            </div>
            {!!purchase && (
              <div className="ml-auto">
                <ProgressButton
                  courseId={courseId}
                  lessonId={lessonId}
                  isCompleted={!!userLessonProgress?.isCompleted}
                  disabled={userLessonProgressLoading}
                />
              </div>
            )}
          </div>
          <div className="mb-6 flex justify-between">
            <Button
              variant="outline"
              disabled={lessonLoading || !lesson?.prevLesson}
              onClick={() =>
                router.push(
                  `/courses/${courseId}/learn/lessons/${lesson?.prevLesson?.id}`
                )
              }
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous Lesson
            </Button>
            <Button
              variant="outline"
              disabled={lessonLoading || !lesson?.nextLesson}
              onClick={() =>
                router.push(
                  `/courses/${courseId}/learn/lessons/${lesson?.nextLesson?.id}`
                )
              }
            >
              Next Lesson <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          onClick={() => setOpen(!open)}
          className={cn(
            `fixed bottom-4 border border-sky-200 bg-sky-100 tracking-wide text-sky-800 hover:bg-sky-50 hover:text-sky-800 right-[calc(${!isMobile && '23%+'}20px)] z-10 min-w-[100px]`,
            isMobile && 'right-[20px]',
            !isMobile && 'right-[calc(23%+24px)]'
          )}
        >
          Q&A
        </Button>
        {/* <div className="prose max-w-none">
          <h3>Lesson Content</h3>
          <p>
            This is where the lesson content would go. You can add text, code
            snippets, images, and other elements here to provide a comprehensive
            learning experience.
          </p>
          <pre>
            <code>{`
function updateStyles(element, styles) {
  for (let property in styles) {
    element.style[property] = styles[property];
  }
}

// Usage
const myElement = document.getElementById('myElement');
updateStyles(myElement, {
  color: 'blue',
  fontSize: '16px',
  fontWeight: 'bold'
});
              `}</code>
          </pre>
          <p>
            After this section, you might include exercises, quizzes, or
            additional resources to reinforce the learning objectives of the
            lesson.
          </p>
        </div> */}
      </div>
    </ScrollArea>
  )
}
