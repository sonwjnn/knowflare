import { CourseSidebar } from '@/components/courses-sidebar'

import { FiltersMobile } from './filters-mobile'
import { List } from './list'

export default function CoursesPage() {
  return (
    <main className="mt-16 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Courses</h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-1/4">
            <div className="bg-white p-6 shadow-sm lg:hidden">
              <FiltersMobile />
            </div>
            <div className="hidden lg:block">
              <CourseSidebar />
            </div>
          </div>

          <div className="lg:w-3/4">
            <List />
          </div>
        </div>
      </div>
    </main>
  )
}
