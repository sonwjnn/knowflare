import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedvalue] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedvalue(value)
    }, delay || 500)

    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}
