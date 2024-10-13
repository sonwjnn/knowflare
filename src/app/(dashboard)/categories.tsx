import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { UrlObject } from 'url'

export const Categories = () => {
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
    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div
            onMouseEnter={handleMouseEnter}
            className="flex w-full items-center justify-start text-gray-500 hover:text-gray-700"
          >
            Categories
            <ChevronDown className="mr-2 h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-56"
        >
          {categories?.map(category => (
            <DropdownMenuItem key={category.id} asChild>
              <Link
                href={`/courses?categoryId=${category.id}`}
                className="flex w-full items-center justify-between"
              >
                {category.name}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
