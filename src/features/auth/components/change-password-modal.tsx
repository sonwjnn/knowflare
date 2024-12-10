'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useChangePasswordModal } from '@/features/auth/store/use-change-password-modal'

import { ChangePasswordForm } from './change-password-form'

export const ChangePasswordModal = () => {
  const [open, setOpen] = useChangePasswordModal()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <div className="px-6 pt-6">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password must be at least 8 characters and include numbers,
            letters, and special characters (!$@%...).
          </p>
        </div>
        <ChangePasswordForm />
      </DialogContent>
    </Dialog>
  )
}
