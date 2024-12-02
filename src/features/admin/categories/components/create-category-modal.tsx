'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateCategoryModal } from '@/features/admin/categories/store/use-create-category-modal'

import { CreateForm } from './create-form'

export const CreateCategoryModal = () => {
  const [open, setOpen] = useCreateCategoryModal()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Category</DialogTitle>
        </DialogHeader>
        <CreateForm />
      </DialogContent>
    </Dialog>
  )
}
