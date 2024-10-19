import { Button } from '@/components/ui/button'
import { useCoursesFilterStore } from '@/store/use-course-filter'
import { ListFilter } from 'lucide-react'

export const FiltersMobile = () => {
  const [_, setOpen] = useCoursesFilterStore()

  return (
    <Button variant="outline" onClick={() => setOpen(true)}>
      <ListFilter className="mr-2" /> Filters
    </Button>
  )
}
