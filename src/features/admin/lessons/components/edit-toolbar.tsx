import { Button } from '@/components/ui/button'
import { useDeleteLesson } from '@/features/admin/lessons/api/use-delete-lesson'
import { usePublishLesson } from '@/features/admin/lessons/api/use-publish-lesson'
import { useUnpublishLesson } from '@/features/admin/lessons/api/use-unpublish-lesson'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useConfirm } from '@/hooks/use-confirm'
import { useLessonId } from '@/hooks/use-lesson-id'
import { useRouter } from 'next/navigation'

type Props = {
  disabled: boolean
  isPublished: boolean
}

export const EditToolbar = ({ disabled, isPublished }: Props) => {
  const chapterId = useChapterId()
  const lessonId = useLessonId()
  const courseId = useLessonId()
  const router = useRouter()
  const [ComfirmDialog, confirm] = useConfirm(
    'Delete lesson',
    'Are you sure you want to delete this lesson?'
  )

  const { mutate: publishLesson, isPending: publishLessonLoading } =
    usePublishLesson({ id: lessonId, chapterId })

  const { mutate: unpublishLesson, isPending: unpublishLessonLoading } =
    useUnpublishLesson({ id: lessonId, chapterId })
  const { mutate: deleteLesson, isPending: deleteLessonLoading } =
    useDeleteLesson({ id: lessonId, chapterId })

  const isLoading = publishLessonLoading || unpublishLessonLoading

  const onPublish = () => {
    if (isPublished) {
      unpublishLesson()
    } else {
      publishLesson()
    }
  }

  const onDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    deleteLesson(undefined, {
      onSuccess: () => {
        router.replace(`/admin/courses/edit/${courseId}/chapters/${chapterId}`)
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
          <Button disabled={deleteLessonLoading} onClick={onDelete}>
            Delete Lesson
          </Button>
        </div>
      </div>
    </>
  )
}
