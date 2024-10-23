'use client'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CourseLevel } from '@/db/schema'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { Star } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { useState } from 'react'

export const CourseSidebar = () => {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const level = searchParams.get('level') || ''
  const { data: categories, isPending: categoriesLoading } = useGetCategories()
  const pathname = usePathname()
  const router = useRouter()

  const [rating, setRating] = useState<number>(0)

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating === rating ? 0 : selectedRating)
  }

  const levels = Object.values(CourseLevel)

  const onClick = (value: string) => {
    const isSelected = value === categoryId

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          level: level,
          title: title,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    )
    router.push(url)
  }

  const onLevelClick = (value: string) => {
    const isSelected = value === level

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          level: isSelected ? null : value,
          title: title,
          categoryId: categoryId,
        },
      },
      { skipNull: true, skipEmptyString: true }
    )
    router.push(url)
  }

  return (
    <>
      <h2 className="mb-4 text-xl font-semibold">Filters</h2>

      <div className="mb-6">
        <h3 className="mb-2 font-medium">Categories</h3>
        {categoriesLoading ? (
          <p>Loading categories...</p>
        ) : (
          categories?.map(category => (
            <div key={category.id} className="mb-2 flex items-center">
              <Checkbox
                id={category.id}
                checked={category.id === categoryId}
                onCheckedChange={() => onClick(category.id)}
              />
              <label htmlFor={category.id} className="ml-2 text-sm">
                {category.name}
              </label>
            </div>
          ))
        )}
      </div>

      <div className="mb-6">
        <h3 className="mb-2 font-medium">Level</h3>
        {levels.map(item => (
          <div key={item} className="mb-2 flex items-center">
            <Checkbox
              id={item}
              checked={item === level}
              onCheckedChange={() => onLevelClick(item)}
            />
            <label htmlFor={item} className="ml-2 text-sm capitalize">
              {item}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="mb-2 font-medium">Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3].map(stars => (
            <button
              key={stars}
              onClick={() => handleRatingClick(stars)}
              className={`flex w-full items-center rounded-none p-2 transition-all ${
                rating === stars && 'border-2 border-blue-500 bg-blue-50'
              }`}
              aria-label={`${stars} stars and up`}
            >
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < stars
                        ? 'fill-current text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">& up</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
