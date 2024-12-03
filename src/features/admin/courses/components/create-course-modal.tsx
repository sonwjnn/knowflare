'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateCourseModal } from '@/features/admin/courses/store/use-create-course-modal'

import { CreateCourseForm } from './create-course-form'

export const CreateCourseModal = () => {
  const [open, setOpen] = useCreateCourseModal()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Course</DialogTitle>
        </DialogHeader>
        <CreateCourseForm />
      </DialogContent>
    </Dialog>
  )
}
