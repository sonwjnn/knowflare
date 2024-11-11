'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { QrCode, Shield, Smartphone } from 'lucide-react'
import { useState } from 'react'

export function TwoFactorDialog() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [step, setStep] = useState<'initial' | 'setup' | 'verify' | 'success'>('initial')
  const [verificationCode, setVerificationCode] = useState('')

  const handleToggle2FA = () => {
    if (isEnabled) {
      // If 2FA is enabled, show confirmation dialog
      setStep('verify')
    } else {
      // If 2FA is disabled, start setup process
      setStep('setup')
    }
  }

  const handleVerifyCode = () => {
    // TODO: Implement verification logic
    if (verificationCode.length === 6) {
      if (!isEnabled) {
        setStep('success')
        setTimeout(() => {
          setIsEnabled(true)
          setStep('initial')
          setVerificationCode('')
        }, 2000)
      } else {
        setIsEnabled(false)
        setStep('initial')
        setVerificationCode('')
      }
    }
  }

  return (
    <Dialog onOpenChange={(open) => !open && setStep('initial')}>
      <DialogTrigger asChild>
        <Button 
          variant={isEnabled ? "default" : "outline"} 
          className="w-full"
        >
          <Shield className="mr-2 h-4 w-4" />
          {isEnabled ? 'Two-Factor Authentication Enabled' : 'Enable Two-Factor Authentication'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Two-Factor Authentication
          </DialogTitle>
        </DialogHeader>

        {step === 'initial' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {isEnabled ? (
                "Two-factor authentication is currently enabled. This adds an extra layer of security to your account."
              ) : (
                "Add an extra layer of security to your account by requiring both your password and authentication code from your mobile device."
              )}
            </div>
            <Button 
              onClick={handleToggle2FA} 
              variant={isEnabled ? "destructive" : "default"}
              className="w-full"
            >
              {isEnabled ? 'Disable Two-Factor Authentication' : 'Set up Two-Factor Authentication'}
            </Button>
          </div>
        )}

        {step === 'setup' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>1. Install an authenticator app like Google Authenticator or Authy</p>
              <p>2. Scan this QR code with your authenticator app</p>
            </div>
            <div className="flex justify-center p-4 bg-muted/30 rounded-lg">
              <QrCode className="h-32 w-32" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">3. Enter the 6-digit code from your app</p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg tracking-widest"
                />
                <Button onClick={handleVerifyCode} disabled={verificationCode.length !== 6}>
                  Verify
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Please enter the verification code from your authenticator app to disable two-factor authentication.
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg tracking-widest"
              />
              <Button 
                onClick={handleVerifyCode} 
                variant="destructive"
                disabled={verificationCode.length !== 6}
              >
                Disable
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-4 text-center">
            <Smartphone className="h-12 w-12 mx-auto text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Setup Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Two-factor authentication has been enabled for your account.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
