import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export const ChaptersList = () => {
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null)

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
}
