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
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'

import { List } from './list'

const levels = Object.values(CourseLevel)
const ratings = ['4.5+', '4.0+', '3.5+', '3.0+']
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
]

export default function CoursesPage() {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const level = searchParams.get('level') || ''
  const { data: categories, isPending: categoriesLoading } = useGetCategories()
  const pathname = usePathname()
  const router = useRouter()

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
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          level: value,
          title: title,
          categoryId: categoryId,
        },
      },
      { skipNull: true, skipEmptyString: true }
    )
    router.push(url)
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold">Courses</h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-1/4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
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
                {ratings.map(rating => (
                  <div key={rating} className="mb-2 flex items-center">
                    <Checkbox
                      id={rating}
                      checked={false}
                      // onCheckedChange={() =>
                      //   handleCheckboxChange('ratings', rating)
                      // }
                    />
                    <label htmlFor={rating} className="ml-2 text-sm">
                      {rating} stars
                    </label>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="mb-2 font-medium">Sort By</h3>
                {/* <Select
                  value={filters.sort}
                  onValueChange={value =>
                    setFilters(prev => ({ ...prev, sort: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort courses" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
              </div>

              {/* <div>
        <h3 className="mb-2 font-medium">Level</h3>
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
      </div> */}
            </div>
          </div>

          <div className="lg:w-3/4">
            <List />
          </div>
        </div>
      </div>
    </main>
  )
}
