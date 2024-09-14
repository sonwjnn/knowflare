import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { insertCoursesSchema } from '@/db/schema'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useEditCourse } from '../api/use-edit-course'

const formSchema = insertCoursesSchema.pick({
  categoryId: true,
})

type FormValues = z.input<typeof formSchema>

type CategoryCourseFormProps = {
  initialData: {
    categoryId: string | null
  }
  courseId: string
  options: { label: string; value: string }[]
}

export const CategoryCourseForm = ({
  initialData,
  courseId,
  options,
}: CategoryCourseFormProps) => {
  const { mutate: editMutation, isPending } = useEditCourse(courseId)

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => {
    setIsEditing(current => !current)
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    editMutation(values, {
      onSuccess: () => {
        toast.success('Course updated')
        toggleEdit()
      },
      onError: () => {
        toast.error('Something went wrong')
      },
    })
  }

  const selectedOption = options.find(
    option => option.value === initialData?.categoryId
  )?.label

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course category
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit category
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'mt-2 text-sm',
            !initialData?.categoryId && 'italic text-slate-500'
          )}
        >
          {selectedOption || 'No category'}
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
                      onChange={field.onChange}
                      value={field.value}
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
