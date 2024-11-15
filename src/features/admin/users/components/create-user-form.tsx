'use client'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserRole, insertUsersSchema } from '@/db/schema'
import { useCreateUser } from '@/features/admin/users/api/use-create-user'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required!',
  }),
  email: z.string().email().min(7, {
    message: 'Email is required!',
  }),
  password: z.string().min(7, {
    message: 'Password is required!',
  }),
  role: z.string().min(1, {
    message: 'Role is required!',
  }),
})

type FormValues = z.input<typeof formSchema>
export const CreateUserForm = () => {
  const { mutate: createUser, isPending: createUserLoading } = useCreateUser()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: '',
    },
  })

  const { isValid } = form.formState

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createUser(values, {
      onSuccess: () => {
        router.push('/admin/users')
      },
    })
  }

  return (
    <div className="p-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
                    disabled={createUserLoading}
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
                    disabled={createUserLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Type your password"
                    type="password"
                    disabled={createUserLoading}
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
                <Select
                  disabled={createUserLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-0 bg-white text-black outline-none ring-offset-0 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Select a user role" />
                    </SelectTrigger>
                  </FormControl>
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
            <Button type="submit" disabled={!isValid || createUserLoading}>
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
