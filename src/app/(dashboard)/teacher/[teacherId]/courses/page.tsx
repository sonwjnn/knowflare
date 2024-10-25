'use client'

import { useGetTeacherCourses } from '@/features/courses/api/use-get-teacher-courses'
import { useTeacherId } from '@/hooks/use-teacher-id'
import { Loader2 } from 'lucide-react'

import { columns } from './columns'
import { DataTable } from './data-table'

const CoursesPage = () => {
  const teacherId = useTeacherId()
  const { data } = useGetTeacherCourses(teacherId)

  if (!data)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )

  const normalizedData = data.map(course => {
    return {
      ...course,
      date: new Date(course.date),
    }
  })

  return (
    <div className="p-6">
      <DataTable columns={columns} data={normalizedData} />
    </div>
  )
}

export default CoursesPage
