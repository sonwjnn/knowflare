'use client'

import { Button } from '@/components/ui/button'
import { useDeleteCourse } from '@/features/courses/api/use-delete-course'
import { UseConfettiStore } from '@/hooks/use-confetti-store'
import { useConfirm } from '@/hooks/use-confirm'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface ActionsProps {
  disabled: boolean
  courseId: string
  isPublished: boolean
}
const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
  const [ComfirmDialog, confirm] = useConfirm(
    'Delete course',
    'Are you sure you want to delete this course?'
  )

  const { mutate: deleteCourse } = useDeleteCourse(courseId)

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const confetti = UseConfettiStore()

  const onPublish = async () => {
    try {
      setIsLoading(true)
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`)
        toast.success('Course unpublished')
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`)
        toast.success('Course published')
        confetti.onOpen()
      }
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  const handleDelete = async () => {
    const ok = await confirm()

    if (ok) {
      deleteCourse()
    }
  }
  return (
    <div className="flex items-center gap-x-2">
      <ComfirmDialog />
      <Button
        onClick={onPublish}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <Button onClick={handleDelete} size="sm" disabled={isLoading}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default Actions
