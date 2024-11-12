import { Button } from '@/components/ui/button'
import { useDeleteChapter } from '@/features/admin/chapters/api/use-delete-chapter'
import { usePublishChapter } from '@/features/admin/chapters/api/use-publish-chapter'
import { useUnpublishChapter } from '@/features/admin/chapters/api/use-unpublish-chapter'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useConfirm } from '@/hooks/use-confirm'
import { useCourseId } from '@/hooks/use-course-id'
import { useRouter } from 'next/navigation'

type Props = {
  disabled: boolean
  isPublished: boolean
}

export const EditToolbar = ({ disabled, isPublished }: Props) => {
  const courseId = useCourseId()
  const chapterId = useChapterId()
  const router = useRouter()
  const [ComfirmDialog, confirm] = useConfirm(
    'Delete chapter',
    'Are you sure you want to delete this chapter?'
  )

  const { mutate: publishChapter, isPending: publishChapterLoading } =
    usePublishChapter({ id: chapterId, courseId })

  const { mutate: unpublishChapter, isPending: unpublishChapterLoading } =
    useUnpublishChapter({ id: chapterId, courseId })
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

    deleteChapter(undefined, {
      onSuccess: () => {
        router.replace(`/admin/courses/edit/${courseId}`)
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
          <Button disabled={deleteChapterLoading} onClick={onDelete}>
            Delete Chapter
          </Button>
        </div>
      </div>
    </>
  )
}
