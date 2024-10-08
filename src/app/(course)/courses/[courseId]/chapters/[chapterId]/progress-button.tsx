'use client'

import { Button } from '@/components/ui/button'
import { useUpsertProgressChapter } from '@/features/chapters/api/use-upsert-progress-chapter'
import { useConfettiStore } from '@/store/use-confetti-store'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface ProgressButtonProps {
  chapterId: string
  courseId: string
  isCompleted?: boolean
  nextChapterId?: string
}

export const ProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}: ProgressButtonProps) => {
  const { mutate: progressChapter, isPending: progressChapterLoading } =
    useUpsertProgressChapter(chapterId)

  const router = useRouter()
  const [_open, setOpen] = useConfettiStore()

  const onClick = () => {
    progressChapter({
      isCompleted: !isCompleted,
    })

    if (!isCompleted && !nextChapterId) {
      setOpen(true)
    }

    if (!isCompleted && nextChapterId) {
      router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
    }
  }

  const Icon = isCompleted ? XCircle : CheckCircle

  return (
    <Button
      onClick={onClick}
      disabled={progressChapterLoading}
      type="button"
      variant={isCompleted ? 'outline' : 'success'}
      className="w-full md:w-auto"
    >
      {isCompleted ? 'Not completed' : 'Mark as Complete'}{' '}
      <Icon className="ml-2 h-4 w-4" />
    </Button>
  )
}
