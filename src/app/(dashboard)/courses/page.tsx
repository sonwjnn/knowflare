'use client'

import { CourseSidebar } from '@/components/courses-sidebar'

import { FiltersMobile } from './filters-mobile'
import { List } from './list'

export default function CoursesPage() {
  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Courses</h1>

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="md:w-1/4">
            <div className="rounded-lg bg-white p-6 shadow-sm md:hidden">
              <FiltersMobile />
            </div>
            <div className="hidden rounded-lg bg-white p-6 shadow-sm md:block">
              <CourseSidebar />
            </div>
          </div>

          <div className="md:w-3/4">
            <List />
          </div>
        </div>
      </div>
    </main>
  )
}
