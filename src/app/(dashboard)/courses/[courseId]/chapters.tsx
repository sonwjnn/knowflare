import { useGetChapters } from '@/features/chapters/api/use-get-chapters'
import { useCourseId } from '@/hooks/use-course-id'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

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
      <div className="flex h-full min-h-48 w-full flex-col items-center justify-center gap-4">
        <Image
          src="/empty-chapters.svg"
          alt="No chapters"
          className="h-32 w-32 opacity-50"
        />
        <p className="text-lg text-gray-500">
          This course does not have any chapters yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-xl bg-white p-1">
      {chapters?.map((item, i) => (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          key={item.id}
          className="group relative overflow-hidden rounded-lg border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-indigo-100 hover:bg-indigo-50/30 hover:shadow-md"
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-indigo-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 font-semibold text-indigo-600">
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>

            <div className="flex-grow">
              <h3 className="font-medium text-gray-900 transition-colors duration-300 group-hover:text-indigo-600">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                {item.description}
              </p>
            </div>

            {/* {'isLocked' in item && item.isLocked && (
              <div className="group/tooltip relative flex-shrink-0">
                <Lock className="h-5 w-5 text-gray-400" />
                <div className="absolute right-0 top-full z-10 mt-2 w-32 rounded-md bg-gray-800 p-2 text-xs text-white opacity-0 transition-opacity group-hover/tooltip:opacity-100">
                  Chương này đã bị khóa
                </div>
              </div>
            )} */}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
