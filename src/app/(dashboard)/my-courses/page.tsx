'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetPurchases } from '@/features/purchases/api/use-get-purchases'
import { Award, BookOpen, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function EnhancedPurchasedCourses() {
  const { data: courses, isPending: coursesLoading } = useGetPurchases()

  if (coursesLoading) {
    return <CourseCardSkeleton />
  }

  if (courses?.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex w-2/3 flex-col items-center justify-center">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-semibold">No Purchased Courses</h2>
          <p className="mb-4 w-1/2 text-center text-muted-foreground">
            It seems like you haven&apos;t purchased any courses yet. Start
            exploring and purchase a course to begin your learning journey!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <h1 className="mb-8 text-center text-4xl font-extrabold text-gray-900">
          My Learning Journey
        </h1>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {courses?.map(course => (
            <Card
              key={course.id}
              className="flex transform flex-col overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative">
                <Image
                  src={course.imageUrl!}
                  alt={course.title}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="aspect-video w-full object-cover"
                />
                {/* <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground">
                  {course.category}
                </Badge> */}
              </div>
              <CardHeader className="px-4 pb-4">
                <CardTitle className="line-clamp-2 text-xl font-bold">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow px-4">
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between text-sm font-medium">
                      <span>Progress</span>
                      <span>{50}%</span>
                    </div>
                    <Progress value={50} className="h-2 w-full" />
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="mr-2 h-4 w-4 text-primary" />
                    <span>
                      {/* {course.completedLessons} / {course.totalLessons} lessons */}
                      {5} / {10} lessons
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-2 h-4 w-4 text-primary" />
                    {/* <span>{course.duration}</span> */}
                    <span>{'20h'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 pt-4">
                <Link
                  href={`/courses/${course.courseId}/learn`}
                  className="w-full"
                >
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {false ? (
                      <>
                        <Award className="mr-2 h-4 w-4" />
                        View Certificate
                      </>
                    ) : (
                      'Continue Learning'
                    )}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

const CourseCardSkeleton = () => {
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <h1 className="mb-8 text-center text-4xl font-extrabold text-gray-900">
          My Learning Journey
        </h1>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card
              key={index}
              className="flex animate-pulse flex-col overflow-hidden"
            >
              <div className="relative">
                <Skeleton className="aspect-video w-full" />
              </div>
              <CardHeader className="px-4 pb-4">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="flex-grow px-4">
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="mr-2 h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="mr-2 h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 pt-4">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
