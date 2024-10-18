import { Button } from '@/components/ui/button'
import { useChaptersSheet } from '@/features/chapters/store/use-chapters-sheet'
import { Menu } from 'lucide-react'

export const MobileChaptersButton = () => {
  const [open, setOpen] = useChaptersSheet()

  const onClick = () => {
    setOpen(!open)
  }
  return (
    <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClick}>
      <Menu className="h-5 w-5" />
    </Button>
  )
}
