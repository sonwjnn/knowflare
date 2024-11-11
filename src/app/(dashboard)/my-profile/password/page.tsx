import { Shield } from 'lucide-react'

import { PasswordDialog } from './password-dialog'
import { TwoFactorDialog } from './two-factor-dialog'

export default function PasswordPage() {
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

      <div className="space-y-6 max-w-2xl">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Password</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Change your password to protect your account. Use a strong password that you haven&apos;t used for other accounts.
          </p>
          <PasswordDialog />
        </div>

        <div className="rounded-lg border p-6"> 
          <h2 className="mb-4 text-xl font-semibold">Two-Factor Authentication</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Add an extra layer of security to your account by requiring a verification code when signing in from a new device.
          </p> 
          <TwoFactorDialog />
        </div>
      </div>
    </div>
  )
}
