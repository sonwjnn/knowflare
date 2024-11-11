'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCourseId } from '@/hooks/use-course-id'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useCreateChapter } from '../api/use-create-chapter'
import { useCreateChapterModal } from '../store/use-create-chapter-modal'

export const CreateChapterModal = () => {
  const courseId = useCourseId()

  const [open, setOpen] = useCreateChapterModal()
  const [title, setTitle] = useState('')

  const { mutate, isPending } = useCreateChapter(courseId)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitle(value)
  }

  const handleClose = () => {
    setOpen(false)
    setTitle('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate(
      { title, courseId },
      {
        onSuccess: () => {
          handleClose()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a chapter</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            value={title}
            onChange={handleChange}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g. 'Advanced Web Development"
          />

          <div className="flex justify-between">
            <DialogClose>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
