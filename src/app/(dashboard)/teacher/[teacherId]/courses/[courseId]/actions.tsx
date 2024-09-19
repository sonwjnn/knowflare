import { Button } from '@/components/ui/button'
import { useDeleteCourse } from '@/features/courses/api/use-delete-course'
import { usePublishCourse } from '@/features/courses/api/use-publish-course'
import { useUnpublishCourse } from '@/features/courses/api/use-unpublish-course'
import { UseConfettiStore } from '@/hooks/use-confetti-store'
import { useConfirm } from '@/hooks/use-confirm'
import { Trash } from 'lucide-react'

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

  const { mutate: publishCourse, isPending: publishCourseLoading } =
    usePublishCourse(courseId)
  const { mutate: unpublishCourse, isPending: unpublishCourseLoading } =
    useUnpublishCourse(courseId)
  const { mutate: deleteCourse } = useDeleteCourse(courseId)

  const confetti = UseConfettiStore()

  const isLoading = publishCourseLoading || unpublishCourseLoading

  const onPublish = () => {
    if (isPublished) {
      unpublishCourse()
    } else {
      publishCourse()
      confetti.onOpen()
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
      <Button
        onClick={handleDelete}
        className="bg-rose-600 hover:bg-rose-500/90"
        size="sm"
        disabled={isLoading}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default Actions
