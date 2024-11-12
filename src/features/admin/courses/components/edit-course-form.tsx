'use client'

import { FileUpload } from '@/components/custom//file-upload'
import { RichEditor } from '@/components/custom/rich-editor'
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
import { CourseLevel } from '@/db/schema'
import { ChaptersCourseForm } from '@/features/admin/chapters/components/chapters-course-form'
import { useEditCourse } from '@/features/admin/courses/api/use-edit-category'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useGetCourse } from '@/features/courses/api/use-get-course'
import { useCourseId } from '@/hooks/use-course-id'
import { isEmptyHtml } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { CategoryOptions } from './category-options'
import { EditToolbar } from './edit-toolbar'

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title is required and must be at least 2 characters long',
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, {
    message: 'Category is required',
  }),
  level: z.string().optional(),
  imageUrl: z.string().url().optional(),
  price: z.coerce.number().optional(),
})

type FormValues = z.input<typeof formSchema>

export const EditCourseForm = () => {
  const courseId = useCourseId()
  const { data: categories, isPending: categoriesLoading } = useGetCategories()
  const { data: course, isPending: courseLoading } = useGetCourse(courseId)

  const { mutate: editCourse, isPending: editCourseLoading } =
    useEditCourse(courseId)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course?.title,
      description: course?.description || '',
      categoryId: course?.categoryId || '',
      level: course?.level || '',
      imageUrl: course?.imageUrl || '',
      price: course?.price || undefined,
    },
  })

  useEffect(() => {
    if (course) {
      form.setValue('title', course?.title || '')
      form.setValue('description', course?.description || '')
      form.setValue('categoryId', course?.categoryId || '')
      form.setValue('level', course?.level || '')
      form.setValue('imageUrl', course?.imageUrl || '')
      form.setValue('price', course?.price || undefined)
    }
  }, [course, form])

  const { isValid, isSubmitting } = form.formState

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    editCourse(values, { onSuccess: () => {} })
  }

  const categoryOptions = (categories ?? []).map(item => ({
    value: item.id,
    label: item.name,
  }))

  const levelOptions = Object.values(CourseLevel).map(item => ({
    value: item,
    label: item,
  }))

  if (courseLoading || categoriesLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }
  if (!course) {
    return null
  }

  const requiredFields = [
    course.title,
    isEmptyHtml(course.description) ? '' : course.description,
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `${completedFields}/${totalFields}`
  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-x-2">
          <h1 className="text-2xl font-medium">Course Creation</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
        <EditToolbar
          disabled={!isComplete}
          isPublished={!!course.isPublished}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: Web Development for Beginners"
                    disabled={editCourseLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            disabled={editCourseLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RichEditor
                    {...field}
                    placeholder="What is this course about?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-10">
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
                      // disabled={editCourseLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Level <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <CategoryOptions
                      {...field}
                      options={levelOptions}
                      disabled={editCourseLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            disabled={editCourseLoading}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Course Banner <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || ''}
                    onChange={url => field.onChange(url)}
                    endpoint="courseImage"
                    page="Edit Course"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Price <span className="text-red-500">*</span> (USD)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="29.99"
                    disabled={editCourseLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-5">
            <Link href="/admin/courses">
              <Button variant="outline" type="button">
                Back to Courses
              </Button>
            </Link>
            <Button type="submit" disabled={editCourseLoading}>
              Save
            </Button>
          </div>
        </form>
      </Form>
      <ChaptersCourseForm />
    </>
  )
}
