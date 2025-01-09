'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetPurchases } from '@/features/purchases/api/use-get-purchases'
import { BookOpen, Clock, GraduationCap, Trophy } from 'lucide-react'
import Link from 'next/link'

import { Item } from './item'

export default function EnhancedPurchasedCourses() {
  const { data: courses, isPending: coursesLoading } = useGetPurchases()

  if (coursesLoading) {
    return <CourseCardSkeleton />
  }

  if (!courses || courses?.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex w-full max-w-md flex-col items-center justify-center rounded-xl bg-transparent p-8">
          <div className="rounded-full bg-primary/10 p-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">
            No Purchased Courses
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            Ready to start learning? Explore our course catalog and begin your
            educational journey today!
          </p>
          <Link
            href="/courses"
            className="mt-6 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    )
  }

  const completedCourses =
    courses?.filter(course => course?.progress?.progressPercentage === 100)
      ?.length ?? 0

  const inProgressCourses =
    courses?.filter(course => {
      const progress = course?.progress?.progressPercentage
      return typeof progress === 'number' && progress > 0 && progress < 100
    })?.length ?? 0

  return (
    <div className="min-h-screen space-y-8 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Stats Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            My Learning Journey
          </h1>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatsCard
              icon={<BookOpen className="h-6 w-6 text-primary" />}
              title="Total Courses"
              value={courses.length}
              description="Enrolled courses"
            />
            <StatsCard
              icon={<Clock className="h-6 w-6 text-yellow-500" />}
              title="In Progress"
              value={inProgressCourses}
              description="Active courses"
            />
            <StatsCard
              icon={<Trophy className="h-6 w-6 text-green-500" />}
              title="Completed"
              value={completedCourses}
              description="Finished courses"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <Tabs defaultValue="all" className="mt-12">
          <TabsList className="bg- mb-8 py-4">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses?.map(course => (
                <Item
                  key={course.id}
                  courseId={course.courseId}
                  title={course.title}
                  imageUrl={course.imageUrl || ''}
                  author={course.author.name || ''}
                  completedLessons={course.progress?.completedLessons || 0}
                  totalLessons={course.progress?.totalLessons || 0}
                  progressPercentage={course.progress?.progressPercentage || 0}
                />
              ))}
            </div>
          </TabsContent>

          {/* Add similar TabsContent for "in-progress" and "completed" */}
        </Tabs>
      </div>
    </div>
  )
}

interface StatsCardProps {
  icon: JSX.Element
  title: string
  value: number
  description: string
}

const StatsCard = ({ icon, title, value, description }: StatsCardProps) => {
  return (
    <div className="rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-primary/10 p-3">{icon}</div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

// Update CourseCardSkeleton to match new design
const CourseCardSkeleton = () => {
  return (
    <div className="min-h-screen space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Skeleton className="h-10 w-64" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-card p-6 shadow-sm">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
