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
import { useTeacherId } from '@/hooks/use-teacher-id'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useCreateCourse } from '../api/use-create-course'
import { useCreateCourseModal } from '../store/use-create-course-modal'

export const CreateCourseModal = () => {
  const teacherId = useTeacherId()
  const router = useRouter()
  const [open, setOpen] = useCreateCourseModal()
  const [title, setTitle] = useState('')

  const { mutate, isPending } = useCreateCourse()

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
      { title },
      {
        onSuccess: ({ data }) => {
          router.push(`/teacher/${teacherId}/courses/${data.id}`)
          handleClose()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a course</DialogTitle>
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
