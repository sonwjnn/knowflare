import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useConfirm } from '@/hooks/use-confirm'
import { MoreHorizontal, Trash } from 'lucide-react'

import { useDeleteComment } from '../api/use-delete-comment'

type Props = {
  id: string
  content: string | null
  username: string | null
  imageUrl: string | null
  timestamp: string
  canDelete: boolean
}

export const CommentItem = ({
  id,
  content,
  username,
  imageUrl,
  timestamp,
  canDelete,
}: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this comment'
  )

  const { mutate: deleteComment, isPending: deleteCommentLoading } =
    useDeleteComment(id)

  const onDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    deleteComment()
  }

  return (
    <div key={id} className="flex space-x-4">
      <ConfirmDialog />
      <Avatar>
        <AvatarImage src={imageUrl!} alt={username!} />
        <AvatarFallback>{username?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center">
          <span className="font-semibold">{username}</span>
          <span className="ml-2 text-sm text-gray-500">{timestamp}</span>
        </div>
        <p>{content}</p>
        {/* <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <button className="hover:text-gray-700">Thích</button>
                  <button className="hover:text-gray-700">Phản hồi</button>
                  {comment.likes > 0 && (
                    <span>{comment.likes} người thích</span>
                  )}
                </div> */}
      </div>
      {canDelete && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDelete}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
