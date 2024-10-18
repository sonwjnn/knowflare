'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useGetPurchases } from '@/features/purchases/api/use-get-purchases'
import { Award, BookOpen, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const purchasedCourses = [
  {
    id: 1,
    title: 'Advanced Web Development',
    progress: 65,
    totalLessons: 12,
    completedLessons: 8,
    duration: '10 hours',
    image: '',
    category: 'Programming',
  },
  {
    id: 2,
    title: 'Data Science Fundamentals',
    progress: 30,
    totalLessons: 15,
    completedLessons: 5,
    duration: '15 hours',
    image: '',
    category: 'Data',
  },
  {
    id: 3,
    title: 'Mobile App Development with React Native',
    progress: 90,
    totalLessons: 10,
    completedLessons: 9,
    duration: '8 hours',
    image: '',
    category: 'Mobile',
  },
  {
    id: 4,
    title: 'Machine Learning Basics',
    progress: 10,
    totalLessons: 20,
    completedLessons: 2,
    duration: '20 hours',
    image: '',
    category: 'AI',
  },
]

export default function EnhancedPurchasedCourses() {
  const { data: courses, isPending: coursesLoading } = useGetPurchases()

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-4xl font-extrabold text-gray-900">
          My Learning Journey
        </h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {courses?.map(course => (
            <Card
              key={course.id}
              className="flex transform flex-col overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative">
                <Image
                  src={course.imageUrl!}
                  alt={course.title}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="aspect-video w-full object-cover"
                />
                {/* <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground">
                  {course.category}
                </Badge> */}
              </div>
              <CardHeader className="px-4 pb-4">
                <CardTitle className="line-clamp-2 text-xl font-bold">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow px-4">
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between text-sm font-medium">
                      <span>Progress</span>
                      <span>{50}%</span>
                    </div>
                    <Progress value={50} className="h-2 w-full" />
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="mr-2 h-4 w-4 text-primary" />
                    <span>
                      {/* {course.completedLessons} / {course.totalLessons} lessons */}
                      {5} / {10} lessons
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-2 h-4 w-4 text-primary" />
                    {/* <span>{course.duration}</span> */}
                    <span>{'20h'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 pt-4">
                <Link
                  href={`/courses/${course.courseId}/learn`}
                  className="w-full"
                >
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {false ? (
                      <>
                        <Award className="mr-2 h-4 w-4" />
                        View Certificate
                      </>
                    ) : (
                      'Continue Learning'
                    )}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
