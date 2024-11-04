'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useGetCourse } from '@/features/courses/api/use-get-course'
import { useGetCurrentPurchase } from '@/features/purchases/api/use-get-current-purchases'
import { useGetReviews } from '@/features/reviews/api/use-get-reviews'
import { useCourseId } from '@/hooks/use-course-id'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Check, Clock, Loader2, Play, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { useCallback } from 'react'

import { Chapters } from './chapters'
import { Reviews } from './reviews'
import { Sidebar } from './sidebar'

const DATE_FORMAT = 'dd/MM/yyyy'

const courseObjectives = [
  'Understand the fundamentals of the course',
  'Build real-world projects',
  'Learn best practices and advanced techniques',
  'Master professional development workflows',
  'Get a certificate of completion',
  'Access to a private community',
  'Lifetime access to the course',
  '30-Day Money-Back Guarantee',
  "Full refund if you're not satisfied",
  'No commitment, cancel anytime',
]

export default function CourseDetail() {
  const courseId = useCourseId()
  const { data: course, isPending: courseLoading } = useGetCourse(courseId)

  const { data: reviews, isPending: reviewsLoading } = useGetReviews(courseId)
  const { data: currentPurchase, isPending: currentPurchaseLoading } =
    useGetCurrentPurchase(courseId)

  const rating = useCallback(() => {
    if (!reviews || reviews.length === 0) return 0
    const totalRating = reviews.reduce(
      (acc, comment) => acc + comment.rating,
      0
    )
    return totalRating / reviews.length
  }, [reviews])

  const courseDetails = {
    title: course?.title,
    instructor: course?.user?.name,
    rating: rating(),
    students: 12345,
    lastUpdated: course?.date,
    description: course?.description,
    price: course?.price,
    image: course?.imageUrl,
  }

  if (courseLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE]">
      <div className="relative bg-gradient-to-br from-white to-blue-50 pb-20 pt-24">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-20 h-32 w-32 rounded-full bg-blue-100/40 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-40 w-40 rounded-full bg-purple-100/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/courses" className="hover:text-blue-600">
              Courses
            </Link>
            <span>/</span>
            <span className="text-gray-400">{courseDetails.title}</span>
          </div>

          <div className="flex flex-col gap-16 lg:flex-row lg:items-start">
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-600">
                    Featured Course
                  </div>
                  <div className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-600">
                    Bestseller
                  </div>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                  {courseDetails.title}
                </h1>

                <p className="text-xl leading-relaxed text-gray-600">
                  {courseDetails.description}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl bg-white p-6 shadow-md">
                  <div className="mb-2 text-sm font-medium text-gray-500">
                    Course Rating
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'size-5',
                            i < Math.floor(courseDetails.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-gray-200 text-gray-200'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                      {courseDetails.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-md">
                  <div className="mb-2 text-sm font-medium text-gray-500">
                    Total Students
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="size-6 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      {courseDetails.students.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-md">
                  <div className="mb-2 text-sm font-medium text-gray-500">
                    Last Updated
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="size-6 text-green-600" />
                    <span className="text-lg font-medium text-gray-900">
                      {format(
                        new Date(courseDetails.lastUpdated!),
                        DATE_FORMAT
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructor Card */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    About the Instructor
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="size-20 border-4 border-white shadow-md">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={courseDetails.instructor!}
                      />
                      <AvatarFallback>
                        {courseDetails.instructor?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h4 className="text-xl font-semibold text-gray-900">
                        {courseDetails.instructor}
                      </h4>
                      <p className="text-gray-600">
                        Professional Developer & Instructor
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Play className="size-4" />
                          <span>15 Courses</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="size-4" />
                          <span>50K+ Students</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-white p-8 shadow-lg">
                <h3 className="mb-8 text-2xl font-semibold text-gray-900">
                  What you&apos;ll learn
                </h3>
                <ul className="grid gap-6 md:grid-cols-2">
                  {courseObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                        <Check className="size-5" />
                      </div>
                      <span className="text-md text-gray-600">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <Sidebar
              imageUrl={courseDetails.image}
              title={courseDetails.title}
              price={courseDetails.price}
              isPurchased={!!currentPurchase}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 md:px-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h3 className="mb-8 text-2xl font-semibold text-gray-900">
            Course Chapters
          </h3>
          <Chapters />
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h3 className="mb-8 text-2xl font-semibold text-gray-900">
            Student Reviews
          </h3>
          <Reviews />
        </div>
      </div>
    </div>
  )
}
