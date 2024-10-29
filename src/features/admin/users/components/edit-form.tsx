import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetUser } from '@/features/admin/users/api/use-get-user'
import {
  ArrowLeft,
  Loader2,
  Mail,
  Shield,
  Upload,
  User,
  UserRound,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import { useUserId } from '../hooks/use-user-id'

export const EditForm = () => {
  const router = useRouter()
  const userId = useUserId()
  const [isLoading, setIsLoading] = useState(false)
  const { data: user, isPending: userLoading } = useGetUser(userId)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    router.push('/users')
  }

  if (userLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-8">
        <div>
          <div className="flex items-center space-x-5">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.image!} alt={user.name!} />
              <AvatarFallback>{user.name!.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm"
            >
              <Upload className="mr-2 h-4 w-4" />
              Change Image
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={() => {}}
            />
          </div>
        </div>

        <div className="pt-8">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
            <div className="sm:col-span-2">
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserRound className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  name="name"
                  value={user.name || ''}
                  onChange={() => {}}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email || ''}
                  onChange={() => {}}
                  className="pl-10"
                  disabled={true}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </Label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <Select name="role" value={user.role} onValueChange={() => {}}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  )
}
