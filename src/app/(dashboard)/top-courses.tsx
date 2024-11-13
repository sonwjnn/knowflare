import { useGetTopCourses } from '@/features/courses/api/use-get-top-courses'

export const TopCourses = () => {
  const { data: courses, isPending } = useGetTopCourses()

  return (
    <div>
      Top Courses{' '}
      {(courses ?? []).map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  )
}
