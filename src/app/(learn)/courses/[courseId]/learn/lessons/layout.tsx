'use client'

import { ChaptersList } from '@/features/chapters/components/chapters-list'

import { Navbar } from './navbar'

type LessonsLayoutProps = { children: React.ReactNode }

const LessonsLayout = ({ children }: LessonsLayoutProps) => {
  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {children}
        <aside className="hidden w-[23%] flex-col overflow-hidden border-l border-gray-200 bg-white lg:flex">
          <ChaptersList />
        </aside>
      </div>
    </div>
  )
}

export default LessonsLayout
