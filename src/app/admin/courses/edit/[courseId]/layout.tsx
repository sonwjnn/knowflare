'use client'

import { Button } from '@/components/ui/button'
import { useDeleteCourse } from '@/features/admin/courses/api/use-delete-course'
import { useConfirm } from '@/hooks/use-confirm'
import { useCourseId } from '@/hooks/use-course-id'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function EditLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const courseId = useCourseId()
  const [ComfirmDialog, confirm] = useConfirm(
    'Delete course',
    'Are you sure you want to delete this course?'
  )
  const router = useRouter()
  const pathname = usePathname()
  const { mutate: deleteCourse, isPending: deleteCourseLoading } =
    useDeleteCourse(courseId)

  const onDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    deleteCourse()
  }

  const routes = [
    {
      label: 'Basic Information',
      path: `/admin/courses/edit/${courseId}`,
    },
    { label: 'Curriculum', path: `/admin/courses/edit/${courseId}/chapters` },
  ]

  return (
    <div className="container mx-auto flex-grow px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <ComfirmDialog />
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex gap-5">
            {routes.map(route => (
              <Link key={route.path} href={route.path}>
                <Button
                  variant={pathname === route.path ? 'primary' : 'outline'}
                  className="rounded-md font-normal"
                >
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-start gap-5">
            {/* <PublishButton
            disabled={!isCompleted}
            courseId={course.id}
            isPublished={course.isPublished}
            page="Course"
          /> */}
            <Button disabled={deleteCourseLoading} onClick={onDelete}>
              Delete Course
            </Button>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
