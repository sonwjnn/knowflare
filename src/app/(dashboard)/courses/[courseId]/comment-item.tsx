import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useDeleteComment } from '@/features/comments/api/use-delete-comment'
import { useConfirm } from '@/hooks/use-confirm'
import { Star, Trash2 } from 'lucide-react'

type Props = {
  id: string
  canDelete: boolean
  username: string
  content: string
  timestamp: string
  rating: number
}

export const CommentItem = ({
  id,
  canDelete,
  username,
  content,
  timestamp,
  rating,
}: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this comment'
  )
  const { mutate: deleteComment, isPending: deleteCommentLoading } =
    useDeleteComment(id)

  const onDeleteComment = async () => {
    const ok = await confirm()

    if (!ok) return

    deleteComment()
  }

  return (
    <div key={id} className="mb-4 border-b pb-4 last:border-b-0">
      <ConfirmDialog />
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="mr-2 h-10 w-10">
            <AvatarFallback>{username[0]!}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-x-1">
            <p className="font-semibold">{username}</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-300 text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500">{timestamp}</p>
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDeleteComment}
              disabled={deleteCommentLoading}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm">{content}</p>
    </div>
  )
}
