import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGetChapters } from '@/features/chapters/api/use-get-chapters'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useCourseId } from '@/hooks/use-course-id'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export const ChaptersList = () => {
  const courseId = useCourseId()
  const chapterId = useChapterId()
  const { data: chapters, isPending: chaptersLoading } =
    useGetChapters(courseId)
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)

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
      <ScrollArea className="flex-1">
        <div className="p-4">
          {chapters?.map((chapter, index) => (
            <Link
              href={`/courses/${courseId}/learn/chapters/${chapter.id}`}
              key={chapter.id}
              className="mb-2"
            >
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-between text-sm',
                  chapter.id === chapterId && 'bg-accent text-accent-foreground'
                )}
                // onClick={() =>
                //   setExpandedChapter(
                //     expandedChapter === chapter.id ? null : chapter.id
                //   )
                // }
              >
                <span className="truncate font-medium">
                  {index + 1}. {chapter.title}
                </span>
                {/* <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 transition-transform ${
                    expandedChapter === chapter.id ? 'rotate-180 transform' : ''
                  }`}
                /> */}
              </Button>
              {/* {expandedChapter === chapter.id && (
                <div className="ml-4 mt-2 text-xs text-gray-600">
                  <p>{chapter.lessons} lessons</p>
                  <p>{chapter.duration}</p>
                </div>
              )} */}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
