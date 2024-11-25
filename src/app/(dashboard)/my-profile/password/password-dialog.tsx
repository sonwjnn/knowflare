'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

// Hàm kiểm tra độ mạnh mật khẩu
const checkPasswordStrength = (password: string) => {
  let strength = 0
  if (password.length >= 8) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/[a-z]/.test(password)) strength += 1
  if (/[0-9]/.test(password)) strength += 1
  if (/[^A-Za-z0-9]/.test(password)) strength += 1
  return strength
}

// Component hiển thị độ mạnh mật khẩu
const PasswordStrengthBar = ({ password }: { password: string }) => {
  const strength = checkPasswordStrength(password)
  const getStrengthText = () => {
    if (password.length === 0) return ''
    if (strength <= 2) return 'Weak'
    if (strength <= 3) return 'Medium'
    if (strength <= 4) return 'Strong'
    return 'Very Strong'
  }

  const getStrengthColor = () => {
    if (password.length === 0) return 'bg-gray-200'
    if (strength <= 2) return 'bg-red-500'
    if (strength <= 3) return 'bg-yellow-500'
    if (strength <= 4) return 'bg-green-500'
    return 'bg-green-600'
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex h-1.5 w-full gap-1">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`h-full flex-1 rounded-full transition-all duration-300 ${
              index < strength ? getStrengthColor() : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {password.length > 0 && (
        <p
          className={`text-xs ${
            strength <= 2
              ? 'text-red-500'
              : strength <= 3
                ? 'text-yellow-500'
                : 'text-green-600'
          }`}
        >
          {getStrengthText()}
        </p>
      )}
    </div>
  )
}

export function PasswordDialog() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu mới không khớp!')
      return
    }
    // TODO: Implement password change logic
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-[400px]">
        <div className="px-6 pt-6">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password must be at least 8 characters and include numbers,
            letters, and special characters (!$@%...).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                  className="pr-10"
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  className="pr-10"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <PasswordStrengthBar password={newPassword} />
              {newPassword.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">
                    Password must contain:
                  </p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li
                      className={`flex items-center gap-1 ${
                        newPassword.length >= 8 ? 'text-green-600' : ''
                      }`}
                    >
                      • Minimum 8 characters
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        /[A-Z]/.test(newPassword) ? 'text-green-600' : ''
                      }`}
                    >
                      • At least 1 uppercase letter
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        /[0-9]/.test(newPassword) ? 'text-green-600' : ''
                      }`}
                    >
                      • At least 1 number
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        /[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600' : ''
                      }`}
                    >
                      • At least 1 special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <a
            href="#"
            className="inline-block text-sm text-blue-500 hover:text-blue-600 hover:underline"
          >
            Forgot your password?
          </a>

          <div className="flex items-center gap-2">
            <Checkbox id="logout" className="rounded-[4px] border-gray-300" />
            <label
              htmlFor="logout"
              className="select-none text-sm text-gray-600"
            >
              Sign out from other devices
            </label>
          </div>
        </form>

        <div className="border-t bg-gray-50 px-6 py-4">
          <Button
            type="submit"
            className="w-full bg-blue-500 font-medium text-white hover:bg-blue-600"
          >
            Change Password
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
