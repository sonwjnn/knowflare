import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGetChapters } from '@/features/chapters/api/use-get-chapters'
import { useGetCurrentPurchase } from '@/features/purchases/api/use-get-current-purchases'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useCourseId } from '@/hooks/use-course-id'
import { useLessonId } from '@/hooks/use-lesson-id'
import { cn } from '@/lib/utils'
import { Check, ChevronUp, FileText, Loader2, Video } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { LessonItem } from './lesson-item'

export const ChaptersList = () => {
  const courseId = useCourseId()
  const lessonId = useLessonId()

  const { data: chapters, isPending: chaptersLoading } =
    useGetChapters(courseId)

  const { data: purchase, isPending: purchaseLoading } =
    useGetCurrentPurchase(courseId)

  const [expandedChapters, setExpandedChapters] = useState<string[]>([])

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    )
  }

  if (!chapters) return null

  const totalLessons = chapters.reduce(
    (total, chapter) => total + chapter.lessons.length,
    0
  )
  const completedLessons = chapters.reduce(
    (completed, chapter) =>
      completed + chapter.lessons.filter(lesson => lesson.isCompleted).length,
    0
  )

  const calculateProgress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Course Content</h2>
        <div className="mt-2 flex items-center">
          <Progress value={calculateProgress} className="mr-2 flex-1" />
          <span className="whitespace-nowrap text-sm text-gray-600">
            {completedLessons}/{totalLessons}
          </span>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div>
          {chapters?.map((chapter, chapterIndex) => (
            <Collapsible
              key={chapter.id}
              open={expandedChapters.includes(chapter.id)}
              onOpenChange={() => toggleChapter(chapter.id)}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-none px-4 py-2 hover:bg-accent hover:text-accent-foreground">
                <span className="line-clamp-1 text-left font-medium">
                  {chapterIndex + 1}. {chapter.title}
                </span>
                <ChevronUp
                  className={cn(
                    'size-8 transition',
                    !expandedChapters.includes(chapter.id) && 'rotate-180'
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                {chapter.lessons.map(lesson => (
                  <LessonItem
                    key={lesson.id}
                    id={lesson.id}
                    title={lesson.title}
                    lessonType={lesson.lessonType}
                    isActive={lesson.id === lessonId}
                    isCompleted={!!lesson.isCompleted}
                    isLocked={!purchase && !lesson.isFree}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
