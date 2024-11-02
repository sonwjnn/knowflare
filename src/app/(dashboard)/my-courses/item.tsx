import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  courseId: string
  imageUrl: string
  title: string
  author: string
  completedLessons: number
  totalLessons: number
  progressPercentage: number
}

export const Item = ({
  courseId,
  imageUrl,
  title,
  author,
  completedLessons,
  totalLessons,
  progressPercentage,
}: Props) => {
  return (
    <Card className="group relative h-full overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
      <div className="relative overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-30" />
        <Image
          src={imageUrl || '/placeholder.svg?height=400&width=600'}
          alt={title}
          width={0}
          height={0}
          sizes="100vw"
          className="aspect-video w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <CardContent className="space-y-2 p-4 pt-2">
        <div className="space-y-1">
          <h3 className="line-clamp-2 h-12 text-pretty bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-lg font-semibold leading-tight tracking-tight text-transparent">
            {title}
          </h3>
        </div>
        <div className="flex items-center">
          <Progress value={progressPercentage} className="h-2 w-full" />
        </div>
        <div className="flex items-center rounded-2xl bg-gradient-to-r from-sky-500/10 to-sky-500/10 px-4 py-2 text-sm">
          <BookOpen className="mr-2 h-4 w-4 text-primary" />
          <span>
            {completedLessons} / {totalLessons} lessons
          </span>
        </div>
        <Link href={`/courses/${courseId}/learn`} className="w-full">
          <Button variant="success" className="mt-2 w-full">
            {progressPercentage === 0 ? 'Learn Course' : 'Continue Learn'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
