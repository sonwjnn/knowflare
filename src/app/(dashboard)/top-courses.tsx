'use client'

import { useGetTopCourses } from '@/features/courses/api/use-get-top-courses'
import { BookOpen, Loader2, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

export const TopCourses = () => {
  const { data: courses, isPending } = useGetTopCourses()

  if (isPending) {
    return (
      <section className="container py-16">
        <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
          Featured Courses
        </h2>
        <div className="flex h-full min-h-64 w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </section>
    )
  }

  if (!courses || courses.length === 0) {
    return (
      <section className="container py-16">
        <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
          Featured Courses
        </h2>
        <div className="flex h-full min-h-48 w-full items-center justify-center">
          <p className="text-gray-500">No courses available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="container py-16">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Featured Courses</h2>
          <p className="mt-1 text-muted-foreground">
            Discover our most popular and highly-rated courses
          </p>
        </div>
        <Link
          href="/courses"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          View all courses →
        </Link>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: '.next-button',
          prevEl: '.prev-button',
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="relative w-full"
      >
        <div className="absolute left-0 right-0 top-1/2 z-10 flex -translate-y-1/2 justify-between px-4">
          <button className="prev-button group rounded-full bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl">
            <svg
              className="h-6 w-6 text-gray-800 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="next-button group rounded-full bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl">
            <svg
              className="h-6 w-6 text-gray-800 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {courses.map(course => (
          <SwiperSlide key={course.id}>
            <Link href={`/courses/${course.id}`}>
              <div className="group relative h-full overflow-hidden rounded-3xl border bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                <div className="relative overflow-hidden">
                  <Image
                    src={course.imageUrl || '/images/course-placeholder.jpg'}
                    alt={course.title}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="aspect-video w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    onError={e => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/course-placeholder.jpg'
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute left-4 top-4 overflow-hidden rounded-2xl bg-white/95 shadow-lg backdrop-blur-md">
                    <div className="relative px-4 py-2">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <span className="relative z-10 text-base font-bold text-gray-900">
                        ${course.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-4 pt-2">
                  <div className="space-y-1">
                    <h3 className="line-clamp-2 h-12 text-pretty bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-lg font-semibold leading-tight tracking-tight text-transparent">
                      {course.title}
                    </h3>
                    {course.author?.name && (
                      <p className="flex items-center text-sm font-medium text-gray-600">
                        <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-500/10">
                          <svg
                            className="h-4 w-4 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </span>
                        {course.author.name}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {typeof course.avgRating === 'number' && (
                      <div className="flex items-center rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-2">
                        <Star className="h-5 w-5 text-amber-500 transition-all duration-300 group-hover:text-amber-600" />
                        <span className="ml-2 text-sm text-amber-700">
                          {course.avgRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center rounded-2xl bg-sky-500/10 px-4 py-2 text-sky-500">
                      <BookOpen className="h-5 w-5 text-sky-700 transition-all duration-300 group-hover:text-sky-600" />
                      <span className="ml-2 text-sm text-sky-700">
                        {course.totalChapters} Lessons
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
