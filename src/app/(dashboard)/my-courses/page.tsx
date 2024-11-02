'use client'

import { BorderButton } from '@/components/custom/border-button'
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

import { Item } from './item'

export default function EnhancedPurchasedCourses() {
  const { data: courses, isPending: coursesLoading } = useGetPurchases()

  if (coursesLoading) {
    return <CourseCardSkeleton />
  }

  if (courses?.length === 0) {
    return (
      <div className="mt-16 flex h-[50vh] items-center justify-center">
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
    <div className="mt-16 min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold">My Learning</h1>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {courses?.map(course => (
            <Item
              key={course.id}
              courseId={course.id}
              title={course.title}
              imageUrl={course.imageUrl || ''}
              author={'author'}
              completedLessons={course.progress?.completedLessons || 0}
              totalLessons={course.progress?.totalLessons || 0}
              progressPercentage={course.progress?.progressPercentage || 0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const CourseCardSkeleton = () => {
  return (
    <div className="mt-16 min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold">My Learning</h1>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
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
              <CardContent className="flex-grow px-4 py-2 pb-4">
                <div className="space-y-2">
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
