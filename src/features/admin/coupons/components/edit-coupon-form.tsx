'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useEditCoupon } from '@/features/admin/coupons/api/use-edit-coupon'
import { useGetCoupon } from '@/features/admin/coupons/api/use-get-coupon'
import { useCouponId } from '@/features/admin/coupons/hooks/use-coupon-id'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { CategoryOptions } from './category-options'

const formSchema = z.object({
  categoryId: z.string().min(1, {
    message: 'Category is required!',
  }),
  discountAmount: z.number().min(0.01, {
    message: 'Discount amount must be greater than 0!',
  }),
  expires: z.date().min(new Date(), {
    message: 'Expiration date must be in the future!',
  }),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export const EditCouponForm = () => {
  const router = useRouter()
  const couponId = useCouponId()
  const { data: categories, isPending: categoriesLoading } = useGetCategories()
  const { data: coupon, isPending: couponLoading } = useGetCoupon(couponId)
  const { mutate: editCoupon, isPending: editCouponLoading } =
    useEditCoupon(couponId)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: '',
      discountAmount: 0,
      expires: new Date(),
      isActive: true,
    },
  })

  const categoryOptions = (categories ?? []).map(item => ({
    value: item.id,
    label: item.name,
  }))

  useEffect(() => {
    if (coupon) {
      form.setValue('categoryId', coupon.categoryId || '')
      form.setValue('discountAmount', coupon.discountAmount || 0)
      form.setValue('expires', new Date(coupon.expires ?? '') || new Date())
      form.setValue('isActive', coupon.isActive ?? true)
    }
  }, [form, coupon])

  const handleSubmit = async (values: FormValues) => {
    editCoupon(
      { ...values, expires: values.expires.toString() },
      {
        onSuccess: () => {
          router.push('/admin/coupons')
        },
      }
    )
  }

  if (couponLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!coupon) return null

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-8"
      >
        <FormField
          control={form.control}
          name="discountAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Discount amount <span className="text-red-500">*</span> (USD)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="29.99"
                  disabled={editCouponLoading}
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Category <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <CategoryOptions
                  options={categoryOptions}
                  {...field}
                  disabled={editCouponLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expires"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Expiration date <span className="text-red-500">*</span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={`w-[240px] pl-3 text-left font-normal ${!field.value && 'text-muted-foreground'}`}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Active</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={editCouponLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-x-2">
          <Link href="/admin/coupons">
            <Button type="button" variant="outline">
              Back to coupons
            </Button>
          </Link>
          <Button type="submit" disabled={editCouponLoading}>
            Update
          </Button>
        </div>
      </form>
    </Form>
  )
}
