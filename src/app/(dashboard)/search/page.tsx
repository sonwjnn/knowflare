'use client'

// import { getCourses } from '@/actions/get-courses'
import CourseCard from '@/components/course-card'
import CoursesList from '@/components/courses-list'
import SearchInput from '@/components/search-input'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useGetPurchasedCourses } from '@/features/courses/api/use-get-purchased-courses'
import { useSearchParams } from 'next/navigation'

import Categories from './categories'

const Page = () => {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || ''
  const categoryId = searchParams.get('categoryId') || ''

  const { data: categories, isPending: categoriesLoading } = useGetCategories()
  const { data, isPending: coursesLoading } = useGetPurchasedCourses({
    title,
    categoryId,
  })

  const completedCourses = data?.completedCourses ?? []
  const coursesInProgress = data?.coursesInProgress ?? []
  const courses = [...coursesInProgress, ...completedCourses]

  return (
    <>
      <div className="block px-6 pt-6 md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories items={categories ?? []} />
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
    </>
  )
}

export default Page
