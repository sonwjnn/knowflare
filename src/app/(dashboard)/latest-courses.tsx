import { useGetLatestCourses } from '@/features/courses/api/use-get-latest-courses'

export const LatestCourses = () => {
  const { data: courses, isPending } = useGetLatestCourses()

  return (
    <div>
      Latest Courses{' '}
      {(courses ?? []).map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  )
}
