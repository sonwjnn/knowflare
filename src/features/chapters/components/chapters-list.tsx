import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGetChapters } from '@/features/chapters/api/use-get-chapters'
import { useGetCurrentPurchase } from '@/features/purchases/api/use-get-current-purchases'
import { useCourseId } from '@/hooks/use-course-id'
import { useLessonId } from '@/hooks/use-lesson-id'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  CheckCircle,
  ChevronUp,
  Clock,
  FileText,
  Lock,
  PlayCircle,
  Video,
} from 'lucide-react'
import { useEffect, useState } from 'react'

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
  useEffect(() => {
    if (lessonId && chapters) {
      const activeChapter = chapters.find(chapter =>
        chapter.lessons.some(lesson => lesson.id === lessonId)
      )
      if (activeChapter && !expandedChapters.includes(activeChapter.id)) {
        toggleChapter(activeChapter.id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters])

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
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Course Content</h2>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-1.5">
            <span className="text-sm font-medium text-slate-600">
              {chapters.length} sections • {totalLessons} lectures
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium text-slate-700">Progress</span>
            </div>
            <span className="text-lg font-bold text-blue-600">
              {Math.round(calculateProgress)}%
            </span>
          </div>
          <Progress
            value={calculateProgress}
            className="h-2 bg-slate-100"
            // indicatorClassName="bg-blue-600"
          />
          <div className="mt-2 text-right text-sm text-slate-500">
            {completedLessons} of {totalLessons} lessons completed
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-slate-100">
          {chapters?.map((chapter, chapterIndex) => (
            <Collapsible
              key={chapter.id}
              open={expandedChapters.includes(chapter.id)}
              onOpenChange={() => toggleChapter(chapter.id)}
            >
              <CollapsibleTrigger
                className={cn(
                  'w-full px-6 py-4 text-left',
                  'transition-all duration-200 hover:bg-slate-50',
                  'focus:outline-none',
                  chapter.lessons.some(lesson => lesson.id === lessonId) &&
                    'border-l-4 border-blue-500 bg-blue-50/60'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 font-medium text-slate-600">
                      {chapterIndex + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {chapter.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {chapter.lessons.length} lectures •{' '}
                        {chapter.lessons.filter(l => l.isCompleted).length}{' '}
                        completed
                      </p>
                    </div>
                  </div>
                  <ChevronUp
                    className={cn(
                      'h-5 w-5 text-slate-400 transition-transform duration-200',
                      !expandedChapters.includes(chapter.id) && 'rotate-180'
                    )}
                  />
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="bg-slate-50/50">
                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className={cn(
                        'px-6 py-3 transition-colors duration-200',
                        lesson.id === lessonId
                          ? 'border-l-4 border-blue-500 bg-white'
                          : 'border-l-4 border-transparent hover:bg-slate-50',
                        lessonIndex !== chapter.lessons.length - 1 &&
                          'border-b border-slate-100'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full">
                          {lesson.isCompleted ? (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                          ) : !purchase && !lesson.isFree ? (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
                              <Lock className="h-4 w-4 text-orange-500" />
                            </div>
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                              {lesson.lessonType === 'video' ? (
                                <Video className="h-4 w-4 text-blue-600" />
                              ) : (
                                <FileText className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          {!purchase && !lesson.isFree && (
                            <span className="mb-1 inline-block rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                              Premium
                            </span>
                          )}
                          <LessonItem
                            id={lesson.id}
                            title={lesson.title}
                            lessonType={lesson.lessonType}
                            isActive={lesson.id === lessonId}
                            isCompleted={!!lesson.isCompleted}
                            isLocked={!purchase && !lesson.isFree}
                          />
                        </div>

                        <span className="text-sm text-slate-500">
                          {lesson.lessonType === 'video'
                            ? '10:00'
                            : '5 min read'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
