'use client'

import Logo from '@/app/(dashboard)/logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCourseId } from '@/hooks/use-course-id'
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

const chapters = [
  { id: 1, title: 'Introduction', lessons: 3, duration: '07:28' },
  {
    id: 2,
    title: 'Variables, comments, built-in',
    lessons: 10,
    duration: '30:51',
  },
  { id: 3, title: 'Data types', lessons: 26, duration: '01:51:16' },
  { id: 4, title: 'Working with functions', lessons: 15, duration: '53:57' },
  { id: 5, title: 'Working with strings', lessons: 6, duration: '41:21' },
  { id: 6, title: 'Working with numbers', lessons: 5, duration: '26:10' },
  { id: 7, title: 'Working with arrays', lessons: 7, duration: '44:07' },
  { id: 8, title: 'Working with objects', lessons: 10, duration: '01:14:26' },
  { id: 9, title: 'Conditional statements', lessons: 7, duration: '33:12' },
  { id: 10, title: 'Loops', lessons: 16, duration: '01:43:18' },
  {
    id: 11,
    title: 'Advanced array methods',
    lessons: 11,
    duration: '02:06:43',
  },
  { id: 12, title: 'Callbacks', lessons: 12, duration: '01:26:30' },
]

export default function CourseInterface() {
  const courseId = useCourseId()
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null)
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const ChaptersList = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Course Content</h2>
        <div className="mt-2 flex items-center">
          <Progress value={99} className="mr-2 flex-1" />
          <span className="whitespace-nowrap text-sm text-gray-600">
            204/205
          </span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {chapters.map(chapter => (
            <div key={chapter.id} className="mb-2">
              <Button
                variant="ghost"
                className="w-full justify-between text-sm"
                onClick={() =>
                  setExpandedChapter(
                    expandedChapter === chapter.id ? null : chapter.id
                  )
                }
              >
                <span className="truncate font-medium">
                  {chapter.id}. {chapter.title}
                </span>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 transition-transform ${
                    expandedChapter === chapter.id ? 'rotate-180 transform' : ''
                  }`}
                />
              </Button>
              {expandedChapter === chapter.id && (
                <div className="ml-4 mt-2 text-xs text-gray-600">
                  <p>{chapter.lessons} lessons</p>
                  <p>{chapter.duration}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )

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
            {!isLargeScreen && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] p-0">
                  <ChaptersList />
                </SheetContent>
              </Sheet>
            )}
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
          <div className="mx-auto w-full">
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
              <h2 className="text-2xl font-bold">DOM CSS</h2>
              <p className="text-gray-600">Updated 2 months ago</p>
            </div>
            <div className="mb-6 flex justify-between">
              <Button variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Lesson
              </Button>
              <Button variant="outline">
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
        {isLargeScreen && (
          <aside className="flex w-[23%] flex-col overflow-hidden border-l border-gray-200 bg-white">
            <ChaptersList />
          </aside>
        )}
      </div>
    </div>
  )
}
