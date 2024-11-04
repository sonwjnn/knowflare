import { useGetChapters } from '@/features/chapters/api/use-get-chapters'
import { useCourseId } from '@/hooks/use-course-id'
import { Loader2 } from 'lucide-react'

export const Chapters = () => {
  const courseId = useCourseId()
  const { data: chapters, isPending: chaptersLoading } =
    useGetChapters(courseId)

  if (chaptersLoading) {
    return (
      <div className="flex h-full min-h-48 w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (chapters?.length === 0) {
    return (
      <div className="flex h-full min-h-48 w-full items-center justify-center">
        <p>This course has no chapters yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {chapters?.map((item, i) => (
        <div key={item.id} className="flex items-start space-x-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold text-white">
            {i + 1}
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-800">{item.title}</h4>
            <p className="text-sm text-gray-500">{item.description}</p>
            {/* <div className="mt-2">
            <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-600">
              10 Lessons
            </span>
          </div> */}
          </div>
        </div>
      ))}
    </div>
  )
}
