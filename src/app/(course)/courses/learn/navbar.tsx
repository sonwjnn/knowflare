import NavbarRoutes from '@/components/navbar-routes'

import { CourseMobileSidebar } from './mobile-sidebar'

const CourseNavbar = () => {
  return (
    <div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      <CourseMobileSidebar />
      <NavbarRoutes />
    </div>
  )
}

export default CourseNavbar
