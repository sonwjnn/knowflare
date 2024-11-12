'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { insertCoursesSchema } from '@/db/schema'
import { useCreateCourse } from '@/features/admin/courses/api/use-create-course'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { CategoryOptions } from './category-options'

const formSchema = insertCoursesSchema.pick({
  title: true,
  categoryId: true,
})

type FormValues = z.input<typeof formSchema>
export const CreateForm = () => {
  const { data: categories, isPending: categoriesLoading } = useGetCategories()
  const { mutate: createCourse, isPending: createCourseLoading } =
    useCreateCourse()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      categoryId: '',
    },
  })

  const { isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    createCourse(values, {
      onSuccess: () => {
        router.push('/admin/courses')
      },
    })
  }

  const categoryOptions = (categories ?? []).map(item => ({
    value: item.id,
    label: item.name,
  }))

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">
        Let give some basics for your course
      </h1>
      <p className="mt-3 text-sm">
        It is ok if you cannot think of a good title or correct category now.
        You can change them later.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 space-y-8"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Web Development for Beginners"
                    {...field}
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
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategoryOptions options={categoryOptions} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={!isValid || createCourseLoading}>
            Create
          </Button>
        </form>
      </Form>
    </div>
  )
}
