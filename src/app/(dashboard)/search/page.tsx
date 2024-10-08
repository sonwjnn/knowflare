'use client'

// import { getCourses } from '@/actions/get-courses'
// import CourseCard from '@/components/course-card'
// import CoursesList from '@/components/courses-list'
// import SearchInput from '@/components/search-input'
// import { useGetCategories } from '@/features/categories/api/use-get-categories'
// import { useGetCourses } from '@/features/courses/api/use-get-courses'
// import { Loader } from 'lucide-react'
// import { useSearchParams } from 'next/navigation'
// import Categories from './categories'
// const Page = () => {
//   const searchParams = useSearchParams()
//   const title = searchParams.get('title') || ''
//   const categoryId = searchParams.get('categoryId') || ''
//   const { data: categories, isPending: categoriesLoading } = useGetCategories()
//   const { data: courses, isPending: coursesLoading } = useGetCourses({
//     title,
//     categoryId,
//   })
//   if (coursesLoading || categoriesLoading) {
//     return (
//       <>
//         <div className="block px-6 pt-6 md:mb-0 md:hidden">
//           <SearchInput />
//         </div>
//         <div className="h-full p-6">
//           <Categories items={categories ?? []} />
//           <div className="flex h-full items-center justify-center">
//             <Loader className="size-6 animate-spin text-muted-foreground" />
//           </div>
//         </div>
//       </>
//     )
//   }
//   return (
//     <>
//       <div className="block px-6 pt-6 md:mb-0 md:hidden">
//         <SearchInput />
//       </div>
//       <div className="p-6">
//         <Categories items={categories ?? []} />
//         <div>
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {courses?.map(item => (
//               <CourseCard
//                 key={item.id}
//                 id={item.id}
//                 title={item.title}
//                 imageUrl={item.imageUrl!}
//                 chaptersLength={item.chapters.length}
//                 price={item.price!}
//                 progress={item.progress}
//                 category={item?.category?.name}
//               />
//             ))}
//           </div>
//           {courses?.length === 0 && (
//             <div className="mt-10 text-center text-sm text-muted-foreground">
//               Course not found!
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }
// export default Page
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Book,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingCart,
  Star,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const categories = [
  'All Categories',
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

const levels = ['Beginner', 'Intermediate', 'Advanced']

const courses = [
  {
    id: 1,
    title: 'Introduction to Data Science',
    institution: 'University of Michigan',
    instructor: 'Dr. Jane Smith',
    rating: 4.7,
    students: '125,000',
    image: '/placeholder.svg?height=400&width=600',
    price: 49.99,
    level: 'Beginner',
    category: 'Data Science',
  },
  {
    id: 2,
    title: 'Machine Learning Fundamentals',
    institution: 'Stanford University',
    instructor: 'Prof. John Doe',
    rating: 4.9,
    students: '200,000',
    image: '/placeholder.svg?height=400&width=600',
    price: 79.99,
    level: 'Intermediate',
    category: 'Computer Science',
  },
  {
    id: 3,
    title: 'Business Strategy and Management',
    institution: 'Harvard Business School',
    instructor: 'Dr. Emily Brown',
    rating: 4.8,
    students: '150,000',
    image: '/placeholder.svg?height=400&width=600',
    price: 89.99,
    level: 'Advanced',
    category: 'Business',
  },
  {
    id: 4,
    title: 'Introduction to Python Programming',
    institution: 'MIT',
    instructor: 'Prof. Michael Johnson',
    rating: 4.6,
    students: '300,000',
    image: '/placeholder.svg?height=400&width=600',
    price: 59.99,
    level: 'Beginner',
    category: 'Computer Science',
  },
  {
    id: 5,
    title: 'Digital Marketing Essentials',
    institution: 'Google',
    instructor: 'Sarah Thompson',
    rating: 4.7,
    students: '180,000',
    image: '/placeholder.svg?height=400&width=600',
    price: 69.99,
    level: 'Intermediate',
    category: 'Business',
  },
  {
    id: 6,
    title: 'Artificial Intelligence Ethics',
    institution: 'Oxford University',
    instructor: 'Dr. Robert Lee',
    rating: 4.8,
    students: '90,000',
    image: '/placeholder.svg?height=400&width=600',
    price: 99.99,
    level: 'Advanced',
    category: 'Computer Science',
  },
]

type Course = {
  id: number
  title: string
  institution: string
  instructor: string
  rating: number
  students: string
  image: string
  price: number
  level: string
  category: string
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [cartItems, setCartItems] = useState<Course[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const coursesPerPage = 6
  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage

  const filteredCourses = courses.filter(course => {
    const categoryMatch =
      selectedCategory === 'All Categories' ||
      course.category === selectedCategory
    const levelMatch =
      selectedLevels.length === 0 || selectedLevels.includes(course.level)
    const searchMatch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.institution.toLowerCase().includes(searchQuery.toLowerCase())
    return categoryMatch && levelMatch && searchMatch
  })

  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  )
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)

  const addToCart = (course: Course) => {
    setCartItems([...cartItems, course])
  }

  const removeFromCart = (courseId: number) => {
    setCartItems(cartItems.filter(item => item.id !== courseId))
  }

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-700">
                Knowflare
              </Link>
            </div>
            <div className="flex items-center">
              <div className="relative mr-4">
                <Input
                  type="text"
                  placeholder="Search courses..."
                  className="w-64 pl-10"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              </div>
              <div className="relative">
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={() => setIsCartOpen(!isCartOpen)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  <span className="sr-only">Shopping cart</span>
                  <span className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-200 text-xs font-semibold text-blue-800">
                    {cartItems.length}
                  </span>
                </Button>
                {isCartOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-80 rounded-md bg-white shadow-lg">
                    <div className="p-4">
                      <h3 className="mb-2 text-lg font-semibold">
                        Shopping Cart
                      </h3>
                      {cartItems.length === 0 ? (
                        <p>Your cart is empty</p>
                      ) : (
                        <>
                          {cartItems.map(item => (
                            <div
                              key={item.id}
                              className="mb-2 flex items-center justify-between"
                            >
                              <span>{item.title}</span>
                              <div>
                                <span className="mr-2">
                                  ${item.price.toFixed(2)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">Total:</span>
                              <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <Button className="mt-4 w-full">Checkout</Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="w-full md:w-1/4">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold">Filters</h2>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Level
                </label>
                {levels.map(level => (
                  <div key={level} className="mb-2 flex items-center">
                    <Checkbox
                      id={level}
                      checked={selectedLevels.includes(level)}
                      onCheckedChange={checked => {
                        setSelectedLevels(
                          checked
                            ? [...selectedLevels, level]
                            : selectedLevels.filter(l => l !== level)
                        )
                      }}
                    />
                    <label
                      htmlFor={level}
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentCourses.map(course => (
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
                    <h3 className="mb-2 line-clamp-1 text-lg font-semibold">
                      {course.title}
                    </h3>
                    <p className="mb-1 text-sm text-gray-600">
                      {course.institution}
                    </p>
                    <p className="mb-2 text-sm text-gray-500">
                      {course.instructor}
                    </p>
                    <div className="mb-2 flex items-center">
                      <Star className="mr-1 h-4 w-4 text-yellow-400" />
                      <span className="mr-2 text-sm text-gray-600">
                        {course.rating}
                      </span>
                      <span className="text-sm text-gray-400">
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
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="mr-2"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; 2023 Knowflare Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
