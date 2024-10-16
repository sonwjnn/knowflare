'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'

import { List } from './list'

export default function CoursesPage() {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const { data: categories, isPending: categoriesLoading } = useGetCategories()
  const pathname = usePathname()
  const router = useRouter()

  const onClick = (value: string) => {
    const isSelected = value === categoryId

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: title,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    )
    router.push(url)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Courses</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-1/4">
          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="mb-4 text-xl font-semibold">Filters</h2>

            <div className="mb-6">
              <h3 className="mb-2 font-medium">Category</h3>
              <Select
                value={categoryId}
                onValueChange={onClick}
                defaultValue="all"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="all">
                    All categories
                  </SelectItem>
                  {categories?.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
    </main>
  )
}
