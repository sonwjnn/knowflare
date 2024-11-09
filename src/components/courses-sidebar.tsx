'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { CourseLevel } from '@/db/schema'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { LucideIcon, Star } from 'lucide-react'
import {
  BookOpen,
  Filter as FilterIcon,
  Folder as FolderIcon,
  GraduationCap,
  Layers as LayersIcon,
  Rocket,
  Loader2 as Spinner,
  Star as StarIcon,
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { useState } from 'react'

const LevelIcon = ({ level }: { level: CourseLevel }) => {
  const icons = {
    beginner: <BookOpen className="h-4 w-4" />,
    intermediate: <GraduationCap className="h-4 w-4" />,
    advanced: <Rocket className="h-4 w-4" />,
    'all level': <Rocket className="h-4 w-4" />,
  }

  return icons[level] || <BookOpen className="h-4 w-4" />
}

export const CourseSidebar = () => {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const level = searchParams.get('level') || ''
  const rating = searchParams.get('rating') || ''
  const { data: categories, isPending: categoriesLoading } = useGetCategories()
  const pathname = usePathname()
  const router = useRouter()

  const levels = Object.values(CourseLevel)

  const onClick = (value: string) => {
    const isSelected = value === categoryId

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          level: level,
          title: title,
          rating,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    )
    router.push(url, { scroll: false })
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
          rating,
        },
      },
      { skipNull: true, skipEmptyString: true }
    )
    router.push(url, { scroll: false })
  }

  const onRatingClick = (value: string) => {
    const isSelected = value === rating

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          level,
          title,
          categoryId,
          rating: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    )
    router.push(url, { scroll: false })
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* Header */}
      {/* bg-gradient-to-r from-blue-50 to-indigo-50 */}
      <div className="border-b p-4 px-6">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <FilterIcon className="h-5 w-5 text-blue-600" />
          Filters
        </h2>
      </div>

      <div className="p-6">
        {/* Categories Section */}
        <div className="mb-8">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-700">
            <FolderIcon className="h-4 w-4 text-blue-600" />
            Categories
          </h3>
          <div className="space-y-1">
            {categoriesLoading ? (
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <Spinner className="h-4 w-4 animate-spin text-blue-600" />
                <p className="text-sm text-gray-500">Loading categories...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1">
                {categories?.map(category => (
                  <div key={category.id} className="group relative">
                    <button
                      onClick={() => onClick(category.id)}
                      className={`w-full rounded-lg p-3 text-left transition-all hover:bg-blue-50 ${
                        category.id === categoryId ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={category.id}
                          checked={category.id === categoryId}
                          className="border-black-900 border-2 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {category.name}
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Level Section */}
        <div className="mb-8">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-700">
            <LayersIcon className="h-4 w-4 text-blue-600" />
            Level
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {levels.map(item => (
              <button
                key={item}
                onClick={() => onLevelClick(item)}
                className={`group flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-blue-200 hover:bg-blue-50 ${
                  item === level
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-100 bg-white'
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    item === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100'
                  }`}
                >
                  <LevelIcon level={item} />
                </div>
                <span
                  className={`text-sm font-medium capitalize ${
                    item === level ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {item.toLowerCase()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Rating Section */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-700">
            <StarIcon className="h-4 w-4 text-blue-600" />
            Rating
          </h3>
          <div className="space-y-2">
            {['5', '4', '3'].map(stars => (
              <button
                key={stars}
                onClick={() => onRatingClick(stars)}
                className={`group relative w-full overflow-hidden rounded-lg border p-4 transition-all hover:border-blue-200 hover:bg-blue-50 ${
                  rating === stars
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-100 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index < +stars
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        } transition-all group-hover:scale-110`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      {stars}.0+
                    </span>
                  </div>
                  {rating === stars && (
                    <span className="text-xs font-medium text-blue-600">
                      Selected
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
