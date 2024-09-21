'use client'

import { useDebounce } from '@/hooks/use-debounce'
import { Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { useCallback, useEffect, useState } from 'react'

import { Input } from './ui/input'

const SearchInput = () => {
  const [value, setValue] = useState('')
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const currentyCategoryId = searchParams.get('categoryId')

  const onClick = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const url = qs.stringifyUrl(
        {
          url: pathname,
          query: {
            categoryId: currentyCategoryId,
            title: value,
          },
        },
        { skipEmptyString: true, skipNull: true }
      )
      router.push(url)
    },
    [currentyCategoryId, value, pathname, router]
  )

  const onClear = useCallback(() => {
    setValue('')

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentyCategoryId,
        },
      },
      { skipEmptyString: true, skipNull: true }
    )
    router.push(url)
  }, [currentyCategoryId, pathname, router])

  return (
    <form className="relative flex items-center" onSubmit={onClick}>
      <Input
        onChange={e => setValue(e.target.value)}
        value={value}
        className="flex h-10 w-full rounded-lg rounded-r-none border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 lg:w-[600px]"
        placeholder="Search for a course"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-12 inline-flex h-10 w-10 items-center justify-center rounded-none text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
      <button
        className="inline-flex h-10 items-center justify-center rounded-md rounded-l-none bg-sky-700 px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-sky-700/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        type="submit"
      >
        <Search className="h-4 w-4 text-white" />
      </button>
    </form>
  )
}

export default SearchInput
