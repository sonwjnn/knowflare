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
import { useEditUser } from '@/features/admin/users/api/use-edit-user'
import { useGetUser } from '@/features/admin/users/api/use-get-user'
import { useUserId } from '@/features/admin/users/hooks/use-user-id'
import { Loader2, Mail, Shield, Upload, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export const EditForm = () => {
  const router = useRouter()
  const userId = useUserId()
  const { data: user, isPending: userLoading } = useGetUser(userId)
  const { mutate: editUser, isPending: editUserLoading } = useEditUser(userId)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [role, setRole] = useState(user?.role || '')
  const [image, setImage] = useState<string | null>(user?.image || '')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setRole(user.role || '')
      setImage(user.image || '')
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    editUser(
      {
        name,
        role,
        image: image as string | undefined,
      },
      {
        onSuccess: () => {
          router.push('/admin/users')
        },
      }
    )
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
              <AvatarImage src={image || ''} alt={name} />
              <AvatarFallback className="flex items-center justify-center bg-blue-500 text-2xl font-medium text-white">
                {name.charAt(0)}
              </AvatarFallback>
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
              onChange={handleImageChange}
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
                  value={name}
                  onChange={e => setName(e.target.value)}
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
                  value={email}
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
                <Select name="role" value={role} onValueChange={setRole}>
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
          <Button type="submit" disabled={editUserLoading}>
            {editUserLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
