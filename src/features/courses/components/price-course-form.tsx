import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { courses, insertCoursesSchema } from '@/db/schema'
import { cn, formatPrice } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useEditCourse } from '../api/use-edit-course'

const formSchema = insertCoursesSchema.pick({
  price: true,
})

type FormValues = z.input<typeof formSchema>

type CourseFormProps = {
  initialData: typeof courses.$inferSelect
  courseId: string
}

export const PriceCourseForm = ({ initialData, courseId }: CourseFormProps) => {
  const { mutate: editMutation, isPending } = useEditCourse(courseId)

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => {
    setIsEditing(current => !current)
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { price: initialData?.price || undefined },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    editMutation(values, {
      onSuccess: () => {
        toggleEdit()
      },
    })
  }

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course Price
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit price
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'mt-2 text-sm',
            !initialData?.price && 'italic text-slate-500'
          )}
        >
          {initialData?.price ? formatPrice(initialData.price) : 'No price'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isPending}
                      placeholder="Set a price for your course"
                      {...field}
                      onChange={e => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isPending} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
