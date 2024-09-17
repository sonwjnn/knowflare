'use client'

import { Button } from '@/components/ui/button'
import { useDeleteChapter } from '@/features/chapters/api/use-delete-chapter'
import { usePublishChapter } from '@/features/chapters/api/use-publish-chapter'
import { useUnpublishChapter } from '@/features/chapters/api/use-unpublish-chapter'
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

  const { mutate: publishChapter, isPending: publishChapterLoading } =
    usePublishChapter(chapterId)

  const { mutate: unpublishChapter, isPending: unpublishChapterLoading } =
    useUnpublishChapter(chapterId)
  const { mutate: deleteChapter, isPending: deleteChapterLoading } =
    useDeleteChapter(chapterId)

  const isLoading = publishChapterLoading || unpublishChapterLoading

  const onPublish = () => {
    if (isPublished) {
      unpublishChapter()
    } else {
      publishChapter()
    }
  }
  const onDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    deleteChapter()
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
