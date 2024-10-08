// 'use client'
// import CourseCard from '@/components/course-card'
// import { useGetPurchasedCourses } from '@/features/courses/api/use-get-purchased-courses'
// import { CheckCircle, Clock, Loader } from 'lucide-react'
// import InfoCard from './info-card'
// export default function Home() {
//   const { data, isPending } = useGetPurchasedCourses()
//   const completedCourses = data?.completedCourses ?? []
//   const coursesInProgress = data?.coursesInProgress ?? []
//   const courses = [...coursesInProgress, ...completedCourses]
//   if (isPending) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <Loader className="size-6 animate-spin text-muted-foreground" />
//       </div>
//     )
//   }
//   return (
//     <div className="space-y-4 p-6">
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//         <InfoCard
//           icon={Clock}
//           label="In Progress"
//           numberOfItems={coursesInProgress.length}
//         />
//         <InfoCard
//           icon={CheckCircle}
//           label="Completed"
//           numberOfItems={completedCourses.length}
//           variant="success"
//         />
//       </div>
//       <div>
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {courses.map(item => (
//             <CourseCard
//               key={item.id}
//               id={item.id}
//               title={item.title}
//               imageUrl={item.imageUrl!}
//               chaptersLength={item.chapters.length}
//               price={item.price!}
//               progress={item.progress}
//               category={item?.category?.name}
//             />
//           ))}
//         </div>
//         {courses.length === 0 && (
//           <div className="mt-10 text-center text-sm text-muted-foreground">
//             Course not found!
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Book,
  ChevronDown,
  Globe,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  User,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import Navbar from './navbar'

// 'use client'
// import CourseCard from '@/components/course-card'
// import { useGetPurchasedCourses } from '@/features/courses/api/use-get-purchased-courses'
// import { CheckCircle, Clock, Loader } from 'lucide-react'
// import InfoCard from './info-card'
// export default function Home() {
//   const { data, isPending } = useGetPurchasedCourses()
//   const completedCourses = data?.completedCourses ?? []
//   const coursesInProgress = data?.coursesInProgress ?? []
//   const courses = [...coursesInProgress, ...completedCourses]
//   if (isPending) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <Loader className="size-6 animate-spin text-muted-foreground" />
//       </div>
//     )
//   }
//   return (
//     <div className="space-y-4 p-6">
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//         <InfoCard
//           icon={Clock}
//           label="In Progress"
//           numberOfItems={coursesInProgress.length}
//         />
//         <InfoCard
//           icon={CheckCircle}
//           label="Completed"
//           numberOfItems={completedCourses.length}
//           variant="success"
//         />
//       </div>
//       <div>
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {courses.map(item => (
//             <CourseCard
//               key={item.id}
//               id={item.id}
//               title={item.title}
//               imageUrl={item.imageUrl!}
//               chaptersLength={item.chapters.length}
//               price={item.price!}
//               progress={item.progress}
//               category={item?.category?.name}
//             />
//           ))}
//         </div>
//         {courses.length === 0 && (
//           <div className="mt-10 text-center text-sm text-muted-foreground">
//             Course not found!
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// 'use client'
// import CourseCard from '@/components/course-card'
// import { useGetPurchasedCourses } from '@/features/courses/api/use-get-purchased-courses'
// import { CheckCircle, Clock, Loader } from 'lucide-react'
// import InfoCard from './info-card'
// export default function Home() {
//   const { data, isPending } = useGetPurchasedCourses()
//   const completedCourses = data?.completedCourses ?? []
//   const coursesInProgress = data?.coursesInProgress ?? []
//   const courses = [...coursesInProgress, ...completedCourses]
//   if (isPending) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <Loader className="size-6 animate-spin text-muted-foreground" />
//       </div>
//     )
//   }
//   return (
//     <div className="space-y-4 p-6">
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//         <InfoCard
//           icon={Clock}
//           label="In Progress"
//           numberOfItems={coursesInProgress.length}
//         />
//         <InfoCard
//           icon={CheckCircle}
//           label="Completed"
//           numberOfItems={completedCourses.length}
//           variant="success"
//         />
//       </div>
//       <div>
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {courses.map(item => (
//             <CourseCard
//               key={item.id}
//               id={item.id}
//               title={item.title}
//               imageUrl={item.imageUrl!}
//               chaptersLength={item.chapters.length}
//               price={item.price!}
//               progress={item.progress}
//               category={item?.category?.name}
//             />
//           ))}
//         </div>
//         {courses.length === 0 && (
//           <div className="mt-10 text-center text-sm text-muted-foreground">
//             Course not found!
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

interface Course {
  id: number
  title: string
  institution: string
  rating: number
  students: string
  image: string
  price: number
}

export default function KnowflareHomepage() {
  const [cartItems, setCartItems] = useState<Course[]>([])

  const categories = [
    'Data Science',
    'Business',
    'Computer Science',
    'Information Technology',
    'Language Learning',
    'Health',
    'Personal Development',
    'Physical Science and Engineering',
    'Social Sciences',
    'Arts and Humanities',
  ]

  const featuredCourses = [
    {
      id: 1,
      title: 'Machine Learning',
      institution: 'Stanford University',
      rating: 4.8,
      students: '3.8M',
      image: '/placeholder.svg?height=400&width=600',
      price: 49.99,
    },
    {
      id: 2,
      title: 'The Science of Well-Being',
      institution: 'Yale University',
      rating: 4.9,
      students: '3.6M',
      image: '/placeholder.svg?height=400&width=600',
      price: 39.99,
    },
    {
      id: 3,
      title: 'Financial Markets',
      institution: 'Yale University',
      rating: 4.7,
      students: '1.2M',
      image: '/placeholder.svg?height=400&width=600',
      price: 59.99,
    },
    {
      id: 4,
      title: 'Programming for Everybody (Getting Started with Python)',
      institution: 'University of Michigan',
      rating: 4.8,
      students: '2.3M',
      image: '/placeholder.svg?height=400&width=600',
      price: 49.99,
    },
  ]

  const addToCart = (course: Course) => {
    setCartItems([...cartItems, course])
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-70"></div>
          <Image
            src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGJhY2tncm91bmR8ZW58MHx8fHwxNjA0MTQyMjM0&ixlib=rb-1.2.1&q=80&w=1080"
            alt="Background"
            layout="fill"
            objectFit="cover"
            className="mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="md:w-2/3">
            <h1 className="mb-6 text-5xl font-extrabold leading-tight">
              Unlock Your Potential with World-Class Learning
            </h1>
            <p className="mb-8 text-xl text-blue-100">
              Join millions of learners worldwide and explore a universe of
              knowledge. Start your journey to success today!
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button className="bg-white px-8 py-3 text-lg text-blue-700 hover:bg-blue-50">
                Join for Free
              </Button>
              <Button
                variant="outline"
                className="border-white px-8 py-3 text-lg text-white hover:bg-blue-600"
              >
                Try Knowflare for Business
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 -translate-x-1/4 translate-y-1/4 transform">
          <div className="relative h-96 w-96">
            <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500 opacity-20"></div>
            <div className="animation-delay-300 absolute inset-4 animate-pulse rounded-full bg-blue-400 opacity-20"></div>
            <div className="animation-delay-600 absolute inset-8 animate-pulse rounded-full bg-blue-300 opacity-20"></div>
            <div className="absolute inset-16 flex items-center justify-center rounded-full bg-white">
              <Sparkles className="h-20 w-20 text-yellow-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Why Choose Knowflare?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mb-4 rounded-full bg-blue-100 p-4">
                <Book className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Learn from the Best
              </h3>
              <p className="text-gray-600">
                Access courses from top universities and industry leaders
                worldwide.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mb-4 rounded-full bg-green-100 p-4">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Flexible Learning</h3>
              <p className="text-gray-600">
                Study at your own pace, anytime and anywhere in the world.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mb-4 rounded-full bg-purple-100 p-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Career Advancement</h3>
              <p className="text-gray-600">
                Gain skills and credentials to boost your career prospects.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold">Featured Courses</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredCourses.map(course => (
              <div
                key={course.id}
                className="overflow-hidden rounded-lg bg-white shadow-md transition-transform duration-300 hover:scale-105"
              >
                <Image
                  src={course.image}
                  alt={course.title}
                  width={600}
                  height={400}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-semibold">{course.title}</h3>
                  <p className="mb-2 text-sm text-gray-600">
                    {course.institution}
                  </p>
                  <div className="mb-2 flex items-center">
                    <Star className="mr-1 h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {course.rating}
                    </span>
                    <span className="ml-2 text-sm text-gray-400">
                      ({course.students} students)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      ${course.price.toFixed(2)}
                    </span>
                    <Button onClick={() => addToCart(course)}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold">Top categories</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.slice(0, 10).map(category => (
              <Button
                key={category}
                variant="outline"
                className="justify-start text-left"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-8 shadow-lg">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-2/3">
                <h2 className="mb-4 text-3xl font-bold text-white">
                  Start Your Learning Journey Today
                </h2>
                <p className="mb-6 text-lg text-blue-100">
                  Join millions of learners and unlock your potential with
                  Knowflare. Get started for free!
                </p>
                <Button className="bg-white text-blue-700 hover:bg-blue-50">
                  Sign up now
                </Button>
              </div>
              <div className="mt-8 md:mt-0">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Join Knowflare"
                  width={300}
                  height={200}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
