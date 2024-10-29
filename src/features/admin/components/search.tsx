import { Input } from '@/components/ui/input'

export function Search() {
  return (
    <div>
      <Input
        type="search"
        placeholder="Search..."
        className="h-9 px-3 py-1 text-sm md:w-[100px] lg:w-[300px]"
      />
    </div>
  )
}
