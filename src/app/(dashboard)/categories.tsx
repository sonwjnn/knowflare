import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import {
  FaBook,
  FaBriefcase,
  FaBuilding,
  FaChartLine,
  FaGraduationCap,
  FaHardHat,
  FaHeartbeat,
  FaLanguage,
  FaLaptopCode,
  FaUser,
} from 'react-icons/fa'

const categoryIcons: { [key: string]: React.ElementType } = {
  'Teaching & Academics': FaGraduationCap,
  'Sales & Marketing': FaChartLine,
  'Personal Development': FaUser,
  Management: FaBriefcase,
  Language: FaLanguage,
  IT: FaLaptopCode,
  Health: FaHeartbeat,
  English: FaBook,
  'Engineering & Construction': FaHardHat,
  Business: FaBuilding,
}

export const Categories = ({ className }: { className?: string }) => {
  const { data: categories, isPending: categoriesLoading } = useGetCategories()
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 300)
  }

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={handleMouseEnter}
        className={cn('flex items-center rounded-md px-4 py-2', className)}
      >
        Explore Courses
        <ChevronDown
          className={cn(
            'ml-2 h-4 w-4 transition-transform duration-200',
            open ? 'rotate-180 transform' : ''
          )}
        />
      </button>
      {open && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute left-0 z-10 mt-2 w-[400px] rounded-md border bg-white shadow-lg"
        >
          <div className="p-4">
            <div className="mb-4 flex items-center rounded-md border p-2">
              <Search className="mr-2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Courses"
                className="w-full text-sm outline-none"
              />
            </div>
            <h3 className="mb-2 text-xs font-semibold text-gray-500">
              COURSES
            </h3>
            <ul>
              {categories?.map(category => {
                const Icon = categoryIcons[category.name] || FaGraduationCap
                return (
                  <li key={category.id} className="mb-2">
                    <Link
                      href={`/courses?categoryId=${category.id}`}
                      className="flex items-center justify-between rounded p-2 text-sm text-black hover:bg-gray-100"
                    >
                      <span className="flex items-center">
                        <Icon className="mr-2 h-5 w-5 text-gray-500" />
                        {category.name}
                      </span>
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    </Link>
                  </li>
                )
              })}
            </ul>
            <button className="mt-4 w-full rounded-md bg-blue-500 py-2 text-sm text-white">
              Discover All Courses
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
