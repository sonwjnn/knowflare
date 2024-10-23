import { LessonType } from '@/db/schema'
import { useCourseId } from '@/hooks/use-course-id'
import { cn } from '@/lib/utils'
import { CheckCircle, FileText, Lock, PlayCircle, Video } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Props = {
  id: string
  title: string
  lessonType: LessonType
  isActive: boolean
  isCompleted: boolean
  isLocked: boolean
}

export const LessonItem = ({
  id,
  title,
  lessonType,
  isActive,
  isCompleted,
  isLocked,
}: Props) => {
  const router = useRouter()
  const courseId = useCourseId()

  const IconType = lessonType === 'video' ? PlayCircle : FileText

  const Icon = isLocked ? Lock : false ? CheckCircle : IconType

  const onClick = () => {
    if (!isLocked)
      return router.push(`/courses/${courseId}/learn/lessons/${id}`)
  }

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className="w-full disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div
        className={cn(
          'flex items-center justify-between p-2 pl-6 text-sm hover:bg-accent hover:text-accent-foreground',
          isActive &&
            'bg-sky-200 text-accent-foreground hover:bg-sky-200 hover:text-accent-foreground'
        )}
      >
        <div className="flex items-center space-x-2 text-left">
          <Icon
            className={cn(
              'size-4 text-slate-500',
              isActive && 'text-slate-700',
              isCompleted && 'text-emerald-700'
            )}
          />
          <span className="line-clamp-1">{title}</span>
        </div>
        {/* <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                        </span>
                        {isCompleted && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div> */}
      </div>
    </button>
  )
}
