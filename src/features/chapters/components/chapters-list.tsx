import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGetChapters } from '@/features/chapters/api/use-get-chapters'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useCourseId } from '@/hooks/use-course-id'
import { useLessonId } from '@/hooks/use-lesson-id'
import { cn } from '@/lib/utils'
import { Check, ChevronUp, FileText, Video } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export const ChaptersList = () => {
  const courseId = useCourseId()
  const lessonId = useLessonId()

  const { data: chapters, isPending: chaptersLoading } =
    useGetChapters(courseId)
  const [expandedChapters, setExpandedChapters] = useState<string[]>([])

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    )
  }

  return (
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
                {chapter.lessons.map((lesson, lessonIndex) => (
                  <Link
                    href={`/courses/${courseId}/learn/lessons/${lesson.id}`}
                    key={lesson.id}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-between p-2 pl-6 text-sm hover:bg-accent hover:text-accent-foreground',
                        lessonId === lesson.id &&
                          'bg-sky-200 text-accent-foreground hover:bg-sky-200 hover:text-accent-foreground'
                      )}
                    >
                      <div className="flex items-center space-x-2 text-left">
                        {lesson.lessonType === 'video' ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        <span className="line-clamp-1">
                          {chapterIndex + 1}.{lessonIndex + 1} {lesson.title}
                        </span>
                      </div>
                      {/* <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                        </span>
                        {lesson.isCompleted && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div> */}
                    </div>
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
