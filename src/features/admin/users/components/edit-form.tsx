import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserRole } from '@/db/schema'
import { useUserId } from '@/features/admin/users/hooks/use-user-id'
import { useEditUser } from '@/features/auth/api/use-edit-user'
import { useGetUser } from '@/features/auth/api/use-get-user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required!',
  }),
  email: z.string().email().min(7, {
    message: 'Email is required!',
  }),
  role: z.string().min(1, {
    message: 'Role is required!',
  }),

  image: z.string().optional(),
})
type FormValues = z.input<typeof formSchema>

export const EditForm = () => {
  const router = useRouter()
  const userId = useUserId()
  const { data: user, isPending: userLoading } = useGetUser(userId)
  const { mutate: editUser, isPending: editUserLoading } = useEditUser(userId)
  const [image, setImage] = useState<string | null>(user?.image || '')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || '',
      image: user?.image || '',
    },
  })

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
      form.setValue('name', user.name || '')
      form.setValue('email', user.email || '')
      form.setValue('role', user.role || '')
      form.setValue('image', user.image || '')
    }
  }, [form, user])

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    editUser(
      {
        ...values,
        image: (values.image ? values.image : undefined) as string | undefined,
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Type your name"
                  disabled={editUserLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Type your email"
                  type="email"
                  disabled={editUserLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select
                  disabled={editUserLoading}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="bg-white text-black outline-none ring-offset-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select a user role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(UserRole).map(type => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="capitalize"
                      >
                        {type.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-x-2">
          <Link href="/admin/users">
            <Button type="button" variant="outline">
              Back to users
            </Button>
          </Link>
          <Button type="submit" disabled={editUserLoading}>
            Create
          </Button>
        </div>
      </form>
    </Form>
  )
}
