import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { insertCoursesSchema } from '@/db/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useEditCourse } from '../api/use-edit-course'

const formSchema = insertCoursesSchema.pick({
  description: true,
})

type FormValues = z.input<typeof formSchema>

type CourseFormProps = {
  initialData: {
    description: string | null
  }
  courseId: string
}

export const DescriptionCourseForm = ({
  initialData,
  courseId,
}: CourseFormProps) => {
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

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course Description
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="mt-2 text-sm">{initialData?.description}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      value={field.value ?? ''}
                      placeholder="e.g. 'Advanced Web Development'"
                    />
                  </FormControl>
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
