import { Button } from '@/components/ui/button'
import { useDeleteCourse } from '@/features/admin/courses/api/use-delete-course'
import { usePublishCourse } from '@/features/admin/courses/api/use-publish-course'
import { useUnpublishCourse } from '@/features/admin/courses/api/use-unpublish-course'
import { useConfirm } from '@/hooks/use-confirm'
import { useCourseId } from '@/hooks/use-course-id'
import { useRouter } from 'next/navigation'

type Props = {
  disabled: boolean
  isPublished: boolean
}

export const EditToolbar = ({ disabled, isPublished }: Props) => {
  const courseId = useCourseId()
  const router = useRouter()
  const [ComfirmDialog, confirm] = useConfirm(
    'Delete course',
    'Are you sure you want to delete this course?'
  )

  const { mutate: publishCourse, isPending: publishCourseLoading } =
    usePublishCourse(courseId)

  const { mutate: unpublishCourse, isPending: unpublishCourseLoading } =
    useUnpublishCourse(courseId)
  const { mutate: deleteCourse, isPending: deleteCourseLoading } =
    useDeleteCourse(courseId)

  const isLoading = publishCourseLoading || unpublishCourseLoading

  const onPublish = () => {
    if (isPublished) {
      unpublishCourse()
    } else {
      publishCourse()
    }
  }

  const onDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    deleteCourse(undefined, {
      onSuccess: () => {
        router.replace(`/admin/courses`)
      },
    })
  }
  return (
    <>
      <ComfirmDialog />
      <div className="mb-7">
        <div className="flex items-center justify-end gap-2">
          <Button
            onClick={onPublish}
            disabled={disabled || isLoading}
            variant="outline"
          >
            {isPublished ? 'Unpublish' : 'Publish'}
          </Button>
          <Button disabled={deleteCourseLoading} onClick={onDelete}>
            Delete Course
          </Button>
        </div>
      </div>
    </>
  )
}
