'use client'

import { Banner } from '@/components/banner'
import { IconBadge } from '@/components/icon-badge'
import { useGetAttachments } from '@/features/attachments/api/use-get-attachments'
import AttachmentForm from '@/features/attachments/components/attachment-form'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useGetChapters } from '@/features/chapters/api/use-get-chapters'
import { ChaptersCourseForm } from '@/features/chapters/components/chapters-course-form'
import { useGetCourse } from '@/features/courses/api/use-get-course'
import { CategoryCourseForm } from '@/features/courses/components/category-course-form'
import { DescriptionCourseForm } from '@/features/courses/components/description-course-form'
import { ImageCourseForm } from '@/features/courses/components/image-course-form'
import { PriceCourseForm } from '@/features/courses/components/price-course-form'
import { TitleCourseForm } from '@/features/courses/components/title-course-form'
import { useCourseId } from '@/hooks/use-course-id'
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
  Loader,
} from 'lucide-react'

import Actions from './actions'

const CourseIdPage = () => {
  const courseId = useCourseId()

  const { data: course, isPending: coursesLoading } = useGetCourse(courseId)
  const { data: chapters, isPending: chaptersLoading } = useGetChapters(
    course?.id
  )
  const { data: attachments, isPending: attachmentsLoading } =
    useGetAttachments(course?.id)
  const { data: categories, isPending: categoriesLoading } = useGetCategories()

  if (!course || !categories) return null

  const normalizedCourse = {
    ...course,
    date: new Date(course.date),
  }

  const chaptersData = chapters ?? []

  const normalizedAttachments = (attachments ?? []).map(item => ({
    ...item,
    date: new Date(item.date),
  }))

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    chaptersData.some(chapter => chapter.isPublished),
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `(${completedFields}/${totalFields})`
  const isCompleted = requiredFields.every(Boolean)
  const isLoading =
    coursesLoading || chaptersLoading || categoriesLoading || attachmentsLoading

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      {!course.isPublished && (
        <Banner label="This Course is not published yet! this will not visible to the students 🥲" />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course Setup</h1>
            <span className="text-sm text-slate-700">
              Completed all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isCompleted}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleCourseForm
              initialData={normalizedCourse}
              courseId={courseId}
            />
            <DescriptionCourseForm
              initialData={normalizedCourse}
              courseId={courseId}
            />
            <ImageCourseForm
              initialData={normalizedCourse}
              courseId={courseId}
            />
            <CategoryCourseForm
              initialData={normalizedCourse}
              courseId={courseId}
              options={categories.map(category => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Chapter</h2>
              </div>
              <ChaptersCourseForm
                initialData={chaptersData}
                courseId={courseId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceCourseForm
                initialData={normalizedCourse}
                courseId={courseId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm
                initialData={normalizedAttachments}
                courseId={courseId}
                courseImageUrl={course.imageUrl}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseIdPage
