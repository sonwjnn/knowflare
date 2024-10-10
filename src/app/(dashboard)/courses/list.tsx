import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetCourses } from '@/features/courses/api/use-get-courses'
import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export const List = () => {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || ''
  const categoryId = searchParams.get('categoryId') || ''

  const { data: courses, isPending: coursesLoading } = useGetCourses({
    categoryId: categoryId === 'all' ? '' : categoryId,
    title,
  })

  if (coursesLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-6">
              <Skeleton className="mb-4 h-6 w-3/4" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-4 h-4 w-2/3" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses?.map(course => (
        <Link key={course.id} href={`/courses/${course.id}`}>
          <Card
            key={course.id}
            className="overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div className="relative h-48">
              <Image
                src={course.imageUrl || '/placeholder.svg?height=400&width=600'}
                alt={course.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-800">
                {course.title}
              </h3>
              <p className="mb-4 text-sm text-gray-600">{course.description}</p>
              <div className="mb-4 flex items-center">
                <Star className="mr-1 h-5 w-5 text-yellow-400" />
                <span className="mr-2 text-sm font-medium text-gray-800">
                  {5}
                </span>
                <span className="text-sm text-gray-500">(0 students)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  ${course.price.toFixed(2)}
                </span>
                <Button className="rounded-md">Add to cart</Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
