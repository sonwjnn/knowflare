'use client'

import { useGetCourses } from '@/features/courses/api/use-get-courses'
import { Loader } from 'lucide-react'

import { columns } from './columns'
import { DataTable } from './data-table'

const CoursesPage = () => {
  const { data } = useGetCourses()

  if (!data)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )

  const normalizedData = data.map(course => {
    return {
      ...course,
      updatedAt: new Date(course.updatedAt),
      createdAt: new Date(course.createdAt),
    }
  })

  return (
    <div className="p-6">
      <DataTable columns={columns} data={normalizedData} />
    </div>
  )
}

export default CoursesPage
