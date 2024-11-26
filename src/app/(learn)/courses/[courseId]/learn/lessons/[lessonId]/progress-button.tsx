'use client'

import { Button } from '@/components/ui/button'
import { useUpsertProgressLesson } from '@/features/progress/api/use-upsert-progress'
import { useConfettiStore } from '@/store/use-confetti-store'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface ProgressButtonProps {
  lessonId: string
  courseId: string
  isCompleted?: boolean
  nextLessonId?: string
  disabled: boolean
}

export const ProgressButton = ({
  lessonId,
  courseId,
  isCompleted,
  nextLessonId,
  disabled,
}: ProgressButtonProps) => {
  const { mutate: progressChapter, isPending: progressChapterLoading } =
    useUpsertProgressLesson(lessonId)

  const router = useRouter()
  const [_open, setOpen] = useConfettiStore()

  const onClick = () => {
    progressChapter(
      {
        isCompleted: !isCompleted,
      },
      {
        onSuccess: () => {
          if (!isCompleted && !nextLessonId) {
            setOpen(true)
          }

          if (!isCompleted && nextLessonId) {
            router.push(`/courses/${courseId}/learn/lessons/${nextLessonId}`)
          }
        },
      }
    )
  }

  const Icon = isCompleted ? XCircle : CheckCircle

  return (
    <Button
      onClick={onClick}
      disabled={disabled || progressChapterLoading}
      type="button"
      variant={isCompleted ? 'outline' : 'success'}
      className="w-full md:w-auto"
    >
      {isCompleted ? 'Not completed' : 'Mark as Complete'}{' '}
      <Icon className="ml-2 h-4 w-4" />
    </Button>
  )
}
