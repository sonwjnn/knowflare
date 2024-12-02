'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateCouponModal } from '@/features/admin/coupons/store/use-create-coupon-modal'

import { CreateCouponForm } from './create-coupon-form'

export const CreateCouponModal = () => {
  const [open, setOpen] = useCreateCouponModal()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Coupon</DialogTitle>
        </DialogHeader>
        <CreateCouponForm />
      </DialogContent>
    </Dialog>
  )
}
