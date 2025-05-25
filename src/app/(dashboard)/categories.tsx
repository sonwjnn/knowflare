import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
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

const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
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
  const [open, setOpen] = useState(false)
  const { data: categories, isPending: categoriesLoading } = useGetCategories()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <HoverCard
      openDelay={100}
      closeDelay={200}
      open={open}
      onOpenChange={setOpen}
    >
      <HoverCardTrigger asChild>
        <button
          className={cn('flex items-center rounded-md px-2 py-2', className)}
        >
          <strong>Explore Courses</strong>
          <ChevronDown
            className={cn('ml-2 size-5 transition-all', open && 'rotate-180')}
          />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-[400px] p-0">
        <div className="p-4">
          <div className="mb-4 flex items-center rounded-md border p-2">
            <Search className="mr-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Courses"
              className="w-full bg-white text-sm outline-none"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <h3 className="mb-2 text-xs font-semibold text-gray-500">COURSES</h3>
          <ul className="overflow-y-auto">
            {filteredCategories?.map(category => {
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
          <Button variant="primary" className="w-full rounded-md">
            Discover All Courses
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
