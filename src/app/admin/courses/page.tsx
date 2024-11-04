'use client'

import { Search } from '@/features/admin/components/search'
import { useBulkDeleteCourses } from '@/features/admin/courses/api/use-bulk-delete-courses'
import { useGetCourses } from '@/features/admin/courses/api/use-get-courses'
import { Loader2 } from 'lucide-react'

import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'

export default function Users() {
  const { data: courses, isPending: coursesLoading } = useGetCourses()
  const { mutate: deleteCourses } = useBulkDeleteCourses()

  if (coursesLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const normalizeCourses = (courses ?? []).map(item => ({
    ...item,
    date: new Date(item.date),
  }))

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your tasks for this month!
          </p>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          data={normalizeCourses}
          columns={columns}
          onDelete={row => {
            const ids = row.map(r => r.original.id)
            deleteCourses({ ids })
          }}
        />
      </div>
    </>
  )
}
