'use client'

import { useDebounce } from '@/hooks/use-debounce'
import { Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { useCallback, useEffect, useState } from 'react'

import { Input } from './ui/input'

const SearchInput = () => {
  const pathname = usePathname()
  const [value, setValue] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentyCategoryId = searchParams.get('categoryId')

  const onClick = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const url = qs.stringifyUrl(
        {
          url: '/courses',
          query: {
            categoryId: currentyCategoryId,
            title: value,
          },
        },
        { skipEmptyString: true, skipNull: true }
      )
      router.push(url)
    },
    [currentyCategoryId, value, router]
  )

  const onClear = useCallback(() => {
    setValue('')

    if (pathname.includes('/courses')) {
      const url = qs.stringifyUrl(
        {
          url: '/courses',
          query: {
            categoryId: currentyCategoryId,
          },
        },
        { skipEmptyString: true, skipNull: true }
      )
      router.push(url)
    }
  }, [currentyCategoryId, router, pathname])

  return (
    <form onSubmit={onClick}>
      <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
        <div className="w-full max-w-lg lg:max-w-xs">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="search"
              name="search"
              onChange={e => setValue(e.target.value)}
              value={value}
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search for a course"
              type="text"
            />
            {value && (
              <div
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center"
                onClick={onClear}
              >
                <X className="size-4 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

export default SearchInput
