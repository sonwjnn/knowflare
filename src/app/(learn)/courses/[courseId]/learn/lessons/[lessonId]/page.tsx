'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LessonType } from '@/db/schema'
import { useGetChapters } from '@/features/chapters/api/use-get-chapters'
import { useCommentsSheet } from '@/features/comments/store/use-comments-sheet'
import { useGetLesson } from '@/features/lessons/api/use-get-lesson'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useCourseId } from '@/hooks/use-course-id'
import { useLessonId } from '@/hooks/use-lesson-id'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useMedia } from 'react-use'

import QuizComponent from './quiz'

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

export default function CourseInterface() {
  const isMobile = useMedia('(max-width: 1024px)', false)
  const courseId = useCourseId()
  const chapterId = useChapterId()
  const lessonId = useLessonId()

  const router = useRouter()

  const { data: lesson, isPending: lessonLoading } = useGetLesson(lessonId)
  const [open, setOpen] = useCommentsSheet()

  const nextChapter = { id: null }
  const prevChapter = { id: null }

  return (
    <ScrollArea className="flex-1 p-6">
      <div className="relative mx-auto w-full">
        <Button
          onClick={() => setOpen(!open)}
          className={cn(
            `fixed bottom-4 right-[calc(${!isMobile && '23%+'}20px)] z-10`,
            isMobile && 'right-[20px]',
            !isMobile && 'right-[calc(23%+20px)]'
          )}
        >
          Q&A
        </Button>
        {lesson?.lessonType === LessonType.VIDEO && (
          <div className="mb-6 rounded-none bg-black">
            <div className="mx-auto aspect-video max-w-5xl">
              <ReactPlayer
                url="https://utfs.io/f/4e0834ac-eb2a-4e9f-8ae0-11522785c3ca-oz682y.mp4"
                width="100%"
                height="100%"
                controls
              />
            </div>
          </div>
        )}

        {lesson?.lessonType === LessonType.QUIZ && <QuizComponent />}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{lesson?.title}</h2>
          <p className="text-gray-600">Updated 2 months ago</p>
        </div>
        <div className="mb-6 flex justify-between">
          <Button
            variant="outline"
            disabled={lessonLoading || !!prevChapter?.id === false}
            onClick={() =>
              router.push(
                `/courses/${courseId}/learn/chapters/${prevChapter?.id}`
              )
            }
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Lesson
          </Button>
          <Button
            variant="outline"
            disabled={lessonLoading || !!nextChapter?.id === false}
            onClick={() =>
              router.push(
                `/courses/${courseId}/learn/chapters/${nextChapter?.id}`
              )
            }
          >
            Next Lesson <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
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
