'use client'

import CourseCard from '@/components/course-card'
import { useGetPurchasedCourses } from '@/features/courses/api/use-get-purchased-courses'
import { CheckCircle, Clock, Loader } from 'lucide-react'

import InfoCard from './info-card'

export default function Home() {
  const { data, isPending } = useGetPurchasedCourses()

  const completedCourses = data?.completedCourses ?? []
  const coursesInProgress = data?.coursesInProgress ?? []
  const courses = [...coursesInProgress, ...completedCourses]

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map(item => (
            <CourseCard
              key={item.id}
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl!}
              chaptersLength={item.chapters.length}
              price={item.price!}
              progress={item.progress}
              category={item?.category?.name}
            />
          ))}
        </div>
        {courses.length === 0 && (
          <div className="mt-10 text-center text-sm text-muted-foreground">
            Course not found!
          </div>
        )}
      </div>
    </div>
  )
}
