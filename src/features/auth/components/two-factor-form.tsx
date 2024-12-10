'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { useEditProfile } from '@/features/auth/api/use-edit-profile'
import { useCurrentUser } from '@/hooks/use-current-user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  isTwoFactorEnabled: z.boolean().optional(),
})

type FormValues = z.input<typeof formSchema>

export const TwoFactorForm = () => {
  const currentUser = useCurrentUser()
  const { update } = useSession()

  const { mutate, isPending } = useEditProfile(currentUser?.id)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isTwoFactorEnabled: currentUser?.isTwoFactorEnabled || false,
    },
  })

  useEffect(() => {
    if (currentUser) {
      form.setValue(
        'isTwoFactorEnabled',
        currentUser?.isTwoFactorEnabled || false
      )
    }
  }, [currentUser, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate(values, {
      onSuccess: () => {
        update()
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {currentUser?.isOAuth === false && (
          <FormField
            control={form.control}
            name="isTwoFactorEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-col rounded-lg border p-6">
                <div>
                  <FormLabel className="mb-4 text-xl font-semibold">
                    Two Factor Authentication
                  </FormLabel>
                  <FormDescription className="mb-6 text-sm text-muted-foreground">
                    Add an extra layer of security to your account by requiring
                    a verification code when signing in from a new device.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    disabled={isPending}
                    checked={field.value}
                    onCheckedChange={async checked => {
                      field.onChange(checked)

                      await onSubmit({
                        isTwoFactorEnabled: checked,
                      })
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  )
}
