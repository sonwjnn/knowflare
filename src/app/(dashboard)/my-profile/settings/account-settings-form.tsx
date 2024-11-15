'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
// import { EditorContent, useEditor } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'
import {
  AlertCircle,
  Camera,
  Lock,
  Mail,
  MapPin,
  User as UserIcon,
} from 'lucide-react'
import { User } from 'next-auth'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import 'react-quill/dist/quill.snow.css'
import { toast } from 'sonner'
import { z } from 'zod'

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
})

const formSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address').optional(),
    description: z.string().optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional(),
    confirmPassword: z.string().optional(),
    github: z
      .string()
      .url('Please enter a valid URL')
      .optional()
      .or(z.literal('')),
    twitter: z
      .string()
      .url('Please enter a valid URL')
      .optional()
      .or(z.literal('')),
    linkedin: z
      .string()
      .url('Please enter a valid URL')
      .optional()
      .or(z.literal('')),
    website: z
      .string()
      .url('Please enter a valid URL')
      .optional()
      .or(z.literal('')),
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

interface AccountSettingsFormProps {
  user: User
}

export const AccountSettingsForm = ({ user }: AccountSettingsFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.image || null
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.name || '',
      fullName: user.name || '',
      email: user.email || '',
      github: '',
      twitter: '',
      linkedin: '',
      website: '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)
      // API call would go here
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
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

  const [editorContent, setEditorContent] = useState('')

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link'],
      ['clean'],
    ],
  }

  const formats = [
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'header',
    'list',
    'bullet',
    'align',
    'link',
  ]

  const inputClassName =
    'transition-all hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
      {/* Profile Image Section */}
      <Card className="p-6">
        <div className="flex items-center gap-8">
          <div className="group relative">
            <Avatar className="size-24 ring-4 ring-blue-50 transition-all group-hover:ring-blue-100">
              <AvatarImage src={imagePreview || ''} alt={user.name || ''} />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-700 text-2xl text-white">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="size-6 text-white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
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
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium">Personal Information</h3>
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <UserIcon className="size-4" />
                Username
              </Label>
              <Input {...register('username')} className={inputClassName} />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="size-4" />
                Email Address
              </Label>
              <Input
                {...register('email')}
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
              <Input {...register('fullName')} className={inputClassName} />
              {errors.fullName && (
                <p className="text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="size-4" />
                Location
              </Label>
              {/* <Input {...register('fullName')} className={inputClassName} />
              {errors.fullName && (
                <p className="text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )} */}
              <select
                className="w-full rounded border p-3"
                defaultValue="Select your country..."
              >
                <option value="AR">Argentina</option>
                <option value="AU">Australia</option>
                <option value="BE">Belgium</option>
                <option value="BR">Brazil</option>
                <option value="CA">Canada</option>
                <option value="CL">Chile</option>
                <option value="CN">China</option>
                <option value="CO">Colombia</option>
                <option value="DK">Denmark</option>
                <option value="EG">Egypt</option>
                <option value="FI">Finland</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
                <option value="IN">India</option>
                <option value="IE">Ireland</option>
                <option value="IT">Italy</option>
                <option value="JP">Japan</option>
                <option value="KR">South Korea</option>
                <option value="MY">Malaysia</option>
                <option value="MX">Mexico</option>
                <option value="NL">Netherlands</option>
                <option value="NZ">New Zealand</option>
                <option value="NG">Nigeria</option>
                <option value="NO">Norway</option>
                <option value="PL">Poland</option>
                <option value="PT">Portugal</option>
                <option value="RU">Russia</option>
                <option value="SA">Saudi Arabia</option>
                <option value="SG">Singapore</option>
                <option value="ZA">South Africa</option>
                <option value="ES">Spain</option>
                <option value="SE">Sweden</option>
                <option value="CH">Switzerland</option>
                <option value="TH">Thailand</option>
                <option value="AE">United Arab Emirates</option>
                <option value="GB">United Kingdom</option>
                <option value="US">United States</option>
                <option value="VN">Vietnam</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Description Section */}
      <Card className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-medium">Description</h3>
          <p className="text-sm text-muted-foreground">
            Tell us about yourself
          </p>
        </div>
        <div className="space-y-4">
          <div className="prose-sm">
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={content => {
                setEditorContent(content)
                setValue('description', content)
              }}
              modules={modules}
              formats={formats}
              className=""
              placeholder="Write something about yourself..."
            />
          </div>
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
      </Card>

      {/* Social Accounts */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Social Accounts</h3>
          <p className="text-sm text-muted-foreground">
            Connect your social media accounts
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2">
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </Label>
              <Input
                {...register('github')}
                placeholder="github.com/username"
                className={inputClassName}
              />
              {errors.github && (
                <p className="text-sm text-red-500">{errors.github.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </Label>
              <Input
                {...register('twitter')}
                placeholder="twitter.com/username"
                className={inputClassName}
              />
              {errors.twitter && (
                <p className="text-sm text-red-500">{errors.twitter.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </Label>
              <Input
                {...register('linkedin')}
                placeholder="linkedin.com/in/username"
                className={inputClassName}
              />
              {errors.linkedin && (
                <p className="text-sm text-red-500">
                  {errors.linkedin.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Website
              </Label>
              <Input
                {...register('website')}
                placeholder="https://your-website.com"
                className={inputClassName}
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          className="text-red-600 hover:text-red-700"
          onClick={() => {
            // Handle account deletion
            toast.error('Account deletion is not implemented')
          }}
        >
          Delete Account
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  )
}
