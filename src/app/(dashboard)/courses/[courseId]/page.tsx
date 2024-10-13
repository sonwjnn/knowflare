'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCart } from '@/features/carts/use-create-cart'
import { useDeleteCart } from '@/features/carts/use-delete-cart'
import { useGetCartByCourseId } from '@/features/carts/use-get-cart-by-course-id'
import { useCourseId } from '@/hooks/use-course-id'
import {
  BarChart,
  Clock,
  Heart,
  Play,
  ShoppingCart,
  Star,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CourseDetail() {
  const courseId = useCourseId()

  const [isInCart, setIsInCart] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'Alex',
      rating: 5,
      comment:
        'Excellent course! The instructor explains complex concepts very clearly.',
    },
    {
      id: 2,
      user: 'Sam',
      rating: 4,
      comment:
        'Great content, but some sections could use more practical examples.',
    },
    {
      id: 3,
      user: 'Taylor',
      rating: 5,
      comment:
        'This course took my React skills to the next level. Highly recommended!',
    },
  ])
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })

  const { mutate: createCart, isPending: createCartLoading } = useCreateCart()

  const { data: cart, isPending: cartLoading } = useGetCartByCourseId(courseId)

  const { mutate: deleteCart, isPending: deleteCartLoading } = useDeleteCart(
    cart?.id
  )

  const courseDetails = {
    title: 'Advanced React and Redux',
    instructor: 'Jane Doe',
    rating: 4.8,
    students: 12345,
    lastUpdated: 'April 2023',
    description:
      'Master React 18 and Redux with this comprehensive course. Learn to build complex, scalable web applications with the latest features and best practices.',
    price: 99.99,
    image: '/course-image.jpg',
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = reviews.length + 1
    setReviews([...reviews, { id: newId, user: 'You', ...newReview }])
    setNewReview({ rating: 5, comment: '' })
  }

  const onDeleteCart = () => {
    deleteCart()
  }

  const onCreateCart = () => {
    createCart({ courseId })
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Image
            src={courseDetails.image}
            alt={courseDetails.title}
            width={0}
            height={0}
            sizes="100vw"
            className="mb-6 h-auto w-full rounded-lg object-cover"
          />
          <h1 className="mb-4 text-3xl font-bold">{courseDetails.title}</h1>

          <p className="mb-4 text-xl">{courseDetails.description}</p>
          <div className="mb-4 flex items-center">
            <Star className="mr-1 text-yellow-400" />
            <span className="mr-2 font-bold">{courseDetails.rating}</span>
            <span className="text-gray-600">
              ({courseDetails.students.toLocaleString()} students)
            </span>
          </div>
          <p className="mb-4">
            Created by{' '}
            <span className="font-semibold">{courseDetails.instructor}</span>
          </p>
          <p className="mb-4">Last updated: {courseDetails.lastUpdated}</p>

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
                  <CardTitle>What you&apos;ll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      Build powerful, fast, user-friendly and reactive web apps
                    </li>
                    <li>
                      Provide amazing user experiences by leveraging the power
                      of JavaScript with ease
                    </li>
                    <li>
                      Apply for high-paid jobs or work as a freelance developer
                    </li>
                    <li>Learn all about React Hooks and React Components</li>
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
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>Introduction to React</li>
                    <li>React Fundamentals</li>
                    <li>Working with Components</li>
                    <li>State Management with Redux</li>
                    <li>Advanced React Patterns</li>
                    <li>Testing React Applications</li>
                    <li>Deploying React Apps</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="instructor">
              <Card>
                <CardHeader>
                  <CardTitle>Instructor</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src="/placeholder.svg"
                      alt={courseDetails.instructor}
                    />
                    <AvatarFallback>
                      {courseDetails.instructor[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {courseDetails.instructor}
                    </h3>
                    <p className="text-gray-600">Senior React Developer</p>
                    <p className="mt-2">
                      Jane has been teaching React for over 5 years and has
                      helped thousands of students master modern web
                      development.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.map(review => (
                    <div
                      key={review.id}
                      className="mb-4 border-b pb-4 last:border-b-0"
                    >
                      <div className="mb-2 flex items-center">
                        <Avatar className="mr-2 h-10 w-10">
                          <AvatarFallback>{review.user[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{review.user}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <form onSubmit={handleSubmitReview} className="w-full">
                    <h4 className="mb-2 text-lg font-semibold">
                      Write a Review
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <RadioGroup
                          id="rating"
                          className="flex space-x-1"
                          value={newReview.rating.toString()}
                          onValueChange={value =>
                            setNewReview({
                              ...newReview,
                              rating: parseInt(value),
                            })
                          }
                        >
                          {[1, 2, 3, 4, 5].map(value => (
                            <div key={value} className="flex items-center">
                              <RadioGroupItem
                                value={value.toString()}
                                id={`rating-${value}`}
                                className="sr-only"
                              />
                              <Label
                                htmlFor={`rating-${value}`}
                                className="cursor-pointer"
                              >
                                <Star
                                  className={`h-6 w-6 ${
                                    value <= newReview.rating
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div>
                        <Label htmlFor="comment">Your Review</Label>
                        <Textarea
                          id="comment"
                          placeholder="Write your review here..."
                          value={newReview.comment}
                          onChange={e =>
                            setNewReview({
                              ...newReview,
                              comment: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <Button type="submit">Submit Review</Button>
                    </div>
                  </form>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                ${courseDetails.price}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full py-6 text-lg"
                onClick={() => setIsInCart(!isInCart)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                className="w-full py-6 text-lg"
                onClick={() => setIsInWishlist(!isInWishlist)}
              >
                <Heart
                  className={`mr-2 h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`}
                />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Play className="mr-2 h-5 w-5" />
                  <span>12 hours of video</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  <span>All levels</span>
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5" />
                  <span>Certificate</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
