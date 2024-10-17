import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useConfirm } from '@/hooks/use-confirm'
import { useCourseId } from '@/hooks/use-course-id'
import { cn } from '@/lib/utils'
import { Bold, Code, ImageIcon, Italic, Link } from 'lucide-react'
import { useState } from 'react'

import { useCreateComment } from '../api/use-create-comment'

export const CreateCommentForm = () => {
  const courseId = useCourseId()
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this comment content'
  )

  const { mutate: createComment, isPending: createCommentLoading } =
    useCreateComment()

  const [newComment, setNewComment] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (newComment.trim()) {
      createComment(
        {
          courseId,
          content: newComment,
        },
        {
          onSuccess: () => {
            setNewComment('')
            setIsEditing(false)
          },
        }
      )
    }
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const onCancel = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!newComment.trim()) {
      setIsEditing(false)
      return
    }

    const ok = await confirm()

    if (!ok) return

    setNewComment('')
    setIsEditing(false)
  }

  return (
    <>
      <ConfirmDialog />
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          placeholder="Type your comment here ..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            'resize-none',
            isEditing && 'min-h-[100px]',
            !isEditing && 'max-h-10 min-h-10'
          )}
          disabled={createCommentLoading}
        />
        {isEditing && (
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button type="button" size="icon" variant="ghost">
                <Bold className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost">
                <Italic className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost">
                <Link className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost">
                <Code className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-x-2">
              <Button
                variant="ghost"
                onClick={onCancel}
                disabled={createCommentLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createCommentLoading}>
                Comment
              </Button>
            </div>
          </div>
        )}
      </form>
    </>
  )
}
