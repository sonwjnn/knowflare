'use client'

import { RichEditor } from '@/components/custom/rich-editor'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEditProfile } from '@/features/auth/api/use-edit-profile'
import { useCurrentUser } from '@/hooks/use-current-user'
import { zodResolver } from '@hookform/resolvers/zod'
// import { EditorContent, useEditor } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'
import {
  AlertCircle,
  Camera,
  Loader2,
  Lock,
  Mail,
  MapPin,
  User as UserIcon,
} from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import 'react-quill/dist/quill.snow.css'
import { z } from 'zod'

const formSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    fullName: z.string().optional(),
    bio: z.string().optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional(),
    confirmPassword: z.string().optional(),
    email: z.string().email(),
  })
  .refine(
    data => {
      if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword
      }
      return true
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  )

type FormValues = z.infer<typeof formSchema>

export const AccountSettingsForm = () => {
  const currentUser = useCurrentUser()
  const { update } = useSession()

  const { mutate: updateProfile, isPending: updateProfileLoading } =
    useEditProfile(currentUser?.id)

  const [imagePreview, setImagePreview] = useState<string | null>(
    currentUser?.image || null
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentUser?.name || '',
      bio: currentUser?.bio || '',
      fullName: currentUser?.fullName || '',
      email: currentUser?.email || '',
    },
  })
  useEffect(() => {
    if (currentUser) {
      form.setValue('name', currentUser?.name || '')
      form.setValue('bio', currentUser?.bio || '')
      form.setValue('fullName', currentUser?.fullName || '')
      form.setValue('email', currentUser?.email || '')
    }
  }, [currentUser, form])

  const onSubmit = (values: FormValues) => {
    updateProfile(values, {
      onSuccess: () => {
        update()
      },
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageRemove = () => {
    setImagePreview(null)
  }

  if (updateProfileLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!currentUser) return null

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
      <Card className="rounded-xl border-none p-6 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="group relative">
            <Avatar className="size-24 ring-4 ring-blue-50 transition-all group-hover:ring-blue-100">
              <AvatarImage
                src={imagePreview || ''}
                alt={currentUser?.name || ''}
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-700 text-2xl text-white">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="size-6 text-white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={updateProfileLoading}
              />
            </label>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">
              Click on the image to upload a new photo
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  (
                    document.querySelector(
                      'input[type="file"]'
                    ) as HTMLInputElement
                  )?.click()
                }
              >
                Upload New
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700"
                onClick={handleImageRemove}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="rounded-xl border-none p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium">Personal Information</h3>
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <UserIcon className="size-4" />
                Name
              </Label>
              <Input
                {...form.register('name')}
                className="transition-all hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={updateProfileLoading}
              />
            </div>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="size-4" />
                Email Address
              </Label>
              <Input
                {...form.register('email')}
                type="email"
                disabled
                className="bg-slate-50"
              />
              <p className="text-xs text-muted-foreground">
                Contact support to change your email address
              </p>
            </div>
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <UserIcon className="size-4" />
                Full Name
              </Label>
              <Input
                {...form.register('fullName')}
                className="transition-all hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={updateProfileLoading}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-xl border-none p-6 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-medium">Bio</h3>
          <p className="text-sm text-muted-foreground">
            Tell us about yourself
          </p>
        </div>
        <div className="space-y-4">
          <div className="prose-sm">
            <RichEditor
              onChange={content => form.setValue('bio', content)}
              value={form.watch('bio')}
              placeholder="Type your bio here..."
            />
          </div>
        </div>
      </Card>

      <div className="flex items-center">
        {/* <Button
          type="button"
          variant="ghost"
          className="text-red-600 hover:text-red-700"
          onClick={() => {
            // Handle account deletion
            toast.error('Account deletion is not implemented')
          }}
        >
          Delete Account
        </Button> */}
        <div className="ml-auto flex gap-2">
          <Button
            type="submit"
            variant="success"
            className="rounded-md"
            disabled={updateProfileLoading}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  )
}
