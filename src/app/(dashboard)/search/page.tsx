// import { getCourses } from '@/actions/get-courses'
import CoursesList from '@/components/courses-list'
import SearchInput from '@/components/search-input'
import { protectServer } from '@/features/auth/utils'
import { redirect } from 'next/navigation'

import Categories from './categories'

interface pageProps {
  searchParams: {
    title: string
    categoryId: string
  }
}

const Page = async ({ searchParams }: pageProps) => {
  await protectServer()

  // const categories = await db.category.findMany({
  //   orderBy: {
  //     name: "asc",
  //   },
  // });
  // const courses = await getCourses({ userId, ...searchParams });
  return (
    <>
      <div className="block px-6 pt-6 md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <div className="p-6">
        {/* <Categories items={categories} />
        <CoursesList items={courses} /> */}
      </div>
    </>
  )
}

export default Page
