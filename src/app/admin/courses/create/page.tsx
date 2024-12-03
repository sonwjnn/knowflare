'use client'

import { CreateCourseForm } from '@/features/admin/courses/components/create-course-form'

export default function EditUser() {
  return (
    <div className="container mx-auto flex-grow px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <CreateCourseForm />
      </div>
    </div>
  )
}
