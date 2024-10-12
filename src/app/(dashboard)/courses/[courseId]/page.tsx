'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCreateCart } from '@/features/carts/use-create-cart'
import { useDeleteCart } from '@/features/carts/use-delete-cart'
import { useGetCartByCourseId } from '@/features/carts/use-get-cart'
import { useCourseId } from '@/hooks/use-course-id'
import {
  BarChart,
  ChevronLeft,
  Clock,
  Download,
  Globe,
  Play,
  ShoppingCart,
  Star,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CourseDetail() {
  const courseId = useCourseId()

  const { mutate: createCart, isPending: createCartLoading } = useCreateCart()

  const { data: cart, isPending: cartLoading } = useGetCartByCourseId(courseId)

  const { mutate: deleteCart, isPending: deleteCartLoading } = useDeleteCart(
    cart?.id
  )

  const course = {
    title: 'Advanced Web Development',
    description: 'Master modern web technologies and frameworks',
    image: '/placeholder.svg?height=400&width=800',
    rating: 4.8,
    students: 1234,
    price: 91.0,
    instructor: 'Jane Doe',
    lastUpdated: 'April 2023',
    language: 'English',
    duration: '20 hours',
    level: 'Intermediate',
  }

  const onDeleteCart = () => {
    deleteCart()
  }

  const onCreateCart = () => {
    createCart({ courseId })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/courses">
        <Button variant="ghost" className="mb-4 pl-0">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </Link>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-2/3">
          <Image
            src={course.image}
            alt={course.title}
            className="mb-4 h-64 w-full rounded-lg object-cover"
            width={800}
            height={400}
          />
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Course Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{course.description}</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" /> {course.duration} of
                      video content
                    </li>
                    <li className="flex items-center">
                      <Download className="mr-2 h-4 w-4" /> Downloadable
                      resources
                    </li>
                    <li className="flex items-center">
                      <Globe className="mr-2 h-4 w-4" /> Full lifetime access
                    </li>
                    <li className="flex items-center">
                      <BarChart className="mr-2 h-4 w-4" /> Certificate of
                      completion
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="curriculum">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Play className="mr-2 h-4 w-4" /> Introduction to the
                      course
                    </li>
                    <li className="flex items-center">
                      <Play className="mr-2 h-4 w-4" /> Setting up your
                      development environment
                    </li>
                    <li className="flex items-center">
                      <Play className="mr-2 h-4 w-4" /> HTML5 and CSS3
                      fundamentals
                    </li>
                    <li className="flex items-center">
                      <Play className="mr-2 h-4 w-4" /> JavaScript ES6+ features
                    </li>
                    <li className="flex items-center">
                      <Play className="mr-2 h-4 w-4" /> React.js basics
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="instructor">
              <Card>
                <CardHeader>
                  <CardTitle>About the Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt={course.instructor}
                      className="mr-4 h-16 w-16 rounded-full"
                      width={100}
                      height={100}
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {course.instructor}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Web Development Expert
                      </p>
                    </div>
                  </div>
                  <p>
                    Jane Doe is a seasoned web developer with over 10 years of
                    experience in the industry. She has worked with numerous
                    startups and large corporations, helping them build scalable
                    and efficient web applications.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 text-4xl font-bold">
                      {course.rating}
                    </div>
                    <div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">
                        {course.students} students
                      </p>
                    </div>
                  </div>
                  {/* Add more detailed reviews here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-3xl font-bold">
                ${course.price.toFixed(2)}
              </div>
              {cart ? (
                <Button
                  disabled={deleteCartLoading}
                  className="mb-4 w-full rounded-md"
                  onClick={onDeleteCart}
                >
                  Remove from Cart
                  <ShoppingCart className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="mb-4 w-full rounded-md"
                  disabled={createCartLoading}
                  onClick={onCreateCart}
                >
                  Add to Cart
                  <ShoppingCart className="ml-2 h-4 w-4" />
                </Button>
              )}

              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Instructor:</span> <span>{course.instructor}</span>
                </li>
                <li className="flex justify-between">
                  <span>Last updated:</span> <span>{course.lastUpdated}</span>
                </li>
                <li className="flex justify-between">
                  <span>Language:</span> <span>{course.language}</span>
                </li>
                <li className="flex justify-between">
                  <span>Duration:</span> <span>{course.duration}</span>
                </li>
                <li className="flex justify-between">
                  <span>Level:</span> <span>{course.level}</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full rounded-md">
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
