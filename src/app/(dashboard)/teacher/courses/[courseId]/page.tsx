'use client'

import { Banner } from '@/components/banner'
import { IconBadge } from '@/components/icon-badge'
import { useGetCourse } from '@/features/courses/api/use-get-course'
import { useCourseId } from '@/hooks/use-course-id'
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react'
import { redirect } from 'next/navigation'

import Actions from './actions'
import AttachmentForm from './attachment-form'
import CategoryForm from './category-form'
import ChaptersForm from './chapters-form'
import DescriptionForm from './description-form'
import ImageForm from './image-form'
import PriceForm from './price-form'
import TitleForm from './title-form'

const CourseIdPage = () => {
  const courseId = useCourseId()

  const { data: course } = useGetCourse(courseId)

  // const course = await db.course.findUnique({
  //   where: { id: params.courseId, userId },
  //   include: {
  //     chapters: { orderBy: { position: 'asc' } },
  //     attachments: { orderBy: { createdAt: 'desc' } },
  //   },
  // })
  // const categories = await db.category.findMany({ orderBy: { name: 'asc' } })
  if (!course) return null

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    // course.chapters.some((chapter: any) => chapter.isPublished),
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `(${completedFields}/${totalFields})`
  const isCompleted = requiredFields.every(Boolean)

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
            {/* <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={[
                { label: 'Web Development', value: '1' },
                { label: 'Mobile Development', value: '2' },
                { label: 'Design', value: '3' },
                { label: 'Marketing', value: '4' },
              ]}
              // options={categories.map(category => ({
              //   label: category.name,
              //   value: category.id,
              // }))}
            /> */}
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Chapter</h2>
              </div>
              {/* <ChaptersForm initialData={course} courseId={course.id} /> */}
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              {/* <PriceForm initialData={course} courseId={course.id} /> */}
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              {/* <AttachmentForm initialData={course} courseId={course.id} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseIdPage
