import { useParams } from 'next/navigation'

export const useLessonId = () => {
  const params = useParams()

  return params.lessonId as string
}
