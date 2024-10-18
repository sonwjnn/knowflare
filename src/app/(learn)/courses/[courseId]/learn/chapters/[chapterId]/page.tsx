'use client'

import Logo from '@/app/(dashboard)/logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGetChapters } from '@/features/chapters/api/use-get-chapters'
import { useCommentsSheet } from '@/features/comments/store/use-comments-sheet'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useCourseId } from '@/hooks/use-course-id'
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { ChaptersList } from './chapters-list'
import { MobileChaptersButton } from './mobile-chapters-button'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

export default function CourseInterface() {
  const courseId = useCourseId()
  const chapterId = useChapterId()
  const router = useRouter()
  const { data: chapters, isPending: chaptersLoading } =
    useGetChapters(courseId)
  const [open, setOpen] = useCommentsSheet()

  const currentChapter =
    chapters?.[chapters.findIndex(chapter => chapter.id === chapterId)] || null
  const nextChapter =
    chapters?.[chapters.findIndex(chapter => chapter.id === chapterId) + 1] ||
    null
  const prevChapter =
    chapters?.[chapters.findIndex(chapter => chapter.id === chapterId) - 1] ||
    null

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <header className="border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/courses/${courseId}`}>
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Logo />
          </div>
          <div className="flex items-center space-x-4">
            <MobileChaptersButton />

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <ScrollArea className="flex-1 p-6">
          <div className="relative mx-auto w-full">
            <Button
              onClick={() => setOpen(!open)}
              className="fixed bottom-4 right-4 z-10"
            >
              Q&A
            </Button>
            <div className="mb-6 rounded-lg bg-black">
              <div className="mx-auto aspect-video max-w-5xl">
                <ReactPlayer
                  url="https://utfs.io/f/4e0834ac-eb2a-4e9f-8ae0-11522785c3ca-oz682y.mp4"
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{currentChapter?.title}</h2>
              <p className="text-gray-600">Updated 2 months ago</p>
            </div>
            <div className="mb-6 flex justify-between">
              <Button
                variant="outline"
                disabled={chaptersLoading || !!prevChapter?.id === false}
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
                disabled={chaptersLoading || !!nextChapter?.id === false}
                onClick={() =>
                  router.push(
                    `/courses/${courseId}/learn/chapters/${nextChapter?.id}`
                  )
                }
              >
                Next Lesson <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="prose max-w-none">
              <h3>Lesson Content</h3>
              <p>
                This is where the lesson content would go. You can add text,
                code snippets, images, and other elements here to provide a
                comprehensive learning experience.
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
            </div>
          </div>
        </ScrollArea>
        <aside className="hidden w-[23%] flex-col overflow-hidden border-l border-gray-200 bg-white lg:flex">
          <ChaptersList />
        </aside>
      </div>
    </div>
  )
}
