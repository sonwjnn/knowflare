'use client'

import { Button } from '@/components/ui/button'
import { useConfirm } from '@/hooks/use-confirm'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface ChapterActionsProps {
  disabled: boolean
  courseId: string
  chapterId: string
  isPublished: boolean
}
const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const [ConfirmModal, confirm] = useConfirm(
    'Are you sure you want to delete this chapter?',
    'This action cannot be undone.'
  )
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onPublish = async () => {
    try {
      setIsLoading(true)
      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        )
        toast.success('Chapter unpublished')
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        )
        toast.success('Chapter published')
      }
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  const onDelete = async () => {
    try {
      const ok = await confirm()

      if (!ok) return

      setIsLoading(true)
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
      toast.success('Chapter deleted')
      router.push(`/teacher/courses/${courseId}`)
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal />
      <Button
        onClick={onPublish}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <Button onClick={onDelete} size="sm" disabled={isLoading}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default ChapterActions
