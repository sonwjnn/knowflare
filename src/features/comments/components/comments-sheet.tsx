import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCommentsSheet } from '@/features/comments/store/use-comments-sheet'
import { useCourseId } from '@/hooks/use-course-id'
import { useCurrentUser } from '@/hooks/use-current-user'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'

import { useGetComments } from '../api/use-get-comments'
import { CommentItem } from './comment-item'
import { CreateCommentForm } from './create-comment-form'

export const CommentsSheet = () => {
  const currentUser = useCurrentUser()
  const courseId = useCourseId()
  const { data: comments, isPending: commentsLoading } =
    useGetComments(courseId)

  const [open, setOpen] = useCommentsSheet()

  const handleOpen = () => {
    if (open) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent className="min-w-full space-y-4 lg:min-w-[800px]">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
          <SheetDescription>
            {(comments ?? []).length} comments
          </SheetDescription>
        </SheetHeader>
        <CreateCommentForm />

        <div className="space-y-4">
          {commentsLoading && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {comments?.map(item => (
            <CommentItem
              key={item.id}
              content={item.content}
              id={item.id}
              username={item.user.name}
              imageUrl={item.user.imageUrl}
              timestamp={format(new Date(item.createdAt!), 'dd/MM/yyyy, HH:mm')}
              canDelete={item.user.id === currentUser?.id}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
