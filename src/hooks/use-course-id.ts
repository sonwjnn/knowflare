import { useParams } from 'next/navigation'

export const useCourseId = () => {
  const params = useParams()

  return params.courseId as string
}
