import CourseProgress from '@/components/course-progress'
import { useGetChapters } from '@/features/chapters/api/use-get-chapters'
import { useGetCourse } from '@/features/courses/api/use-get-course'
import { useCourseId } from '@/hooks/use-course-id'
import { Loader2 } from 'lucide-react'

import CourseSidebarItem from './sidebar-item'

const CourseSidebar = () => {
  const courseId = useCourseId()

  const { data: course, isPending: courseLoading } = useGetCourse(courseId)
  const { data: chapters, isPending: chaptersLoading } = useGetChapters(
    course?.id
  )

  if (courseLoading || chaptersLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!course || !chapters?.length) {
    return null
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto border-r shadow-sm">
      <div className="flex flex-col border-b p-8">
        <h1 className="font-semibold">{course.title}</h1>
        {/* {purchase && (
          <div className="mt-10">
            <CourseProgress
              variant="success"
              size="default"
              value={progressCount}
            />
          </div>
        )} */}
      </div>
      <div className="flex w-full flex-col">
        {chapters.map(chapter => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={false}
            courseId={courseId}
            isLocked={!chapter.isFree && !false}
          />
        ))}
      </div>
    </div>
  )
}

export default CourseSidebar
