// import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import CoursesList from '@/components/courses-list'
import { protectServer } from '@/features/auth/utils'
import { CheckCircle, Clock } from 'lucide-react'

import InfoCard from './info-card'

export default async function Home() {
  await protectServer()

  // const { completedCourses, coursesInProgress } = await getDashboardCourses(
  //   userId
  // );
  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={Clock}
          label="In Progress"
          // numberOfItems={coursesInProgress.length}
          numberOfItems={1}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          // numberOfItems={completedCourses.length}
          numberOfItems={1}
          variant="success"
        />
      </div>
      {/* <CoursesList items={[...coursesInProgress, ...completedCourses]} /> */}
    </div>
  )
}
