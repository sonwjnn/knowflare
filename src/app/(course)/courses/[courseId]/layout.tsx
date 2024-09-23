'use client'

import Navbar from './navbar'
import Sidebar from './sidebar'

const CourseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 h-[80px] w-full md:pl-80">
        <Navbar />
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full w-80 flex-col md:flex">
        <Sidebar />
      </div>
      <main className="h-full pt-[80px] md:pl-80">{children}</main>
    </div>
  )
}

export default CourseLayout
