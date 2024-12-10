'use client'

import { Button } from '@/components/ui/button'
import { TwoFactorForm } from '@/features/auth/components/two-factor-form'
import { useChangePasswordModal } from '@/features/auth/store/use-change-password-modal'
import { Shield } from 'lucide-react'

export default function PasswordPage() {
  const [_, setOpen] = useChangePasswordModal()

  return (
    <div className="container mx-auto max-w-screen-lg p-6">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Password & Security</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your password and security settings to keep your account safe
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Password</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Change your password to protect your account. Use a strong password
            that you haven&apos;t used for other accounts.
          </p>
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="w-full"
          >
            Change Password
          </Button>
        </div>

        <TwoFactorForm />
      </div>
    </div>
  )
}
