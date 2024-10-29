import { Button } from '@/components/custom/button'
import { Layout } from '@/components/custom/layout'
import { sidelinks } from '@/data/sidelinks'
import { cn } from '@/lib/utils'
import { ChevronsLeft, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GiBurningBook } from 'react-icons/gi'

import Logo from '../(dashboard)/logo'
import { Nav } from './navbar'

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export const Sidebar = ({
  className,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) => {
  const [navOpened, setNavOpened] = useState(false)

  /* Make body not scrollable when navBar is opened */
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [navOpened])

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? 'md:w-14' : 'md:w-64'}`,
        className
      )}
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'} w-full bg-black md:hidden`}
      />

      <Layout fixed className={navOpened ? 'h-svh' : ''}>
        {/* Header */}
        <Layout.Header
          sticky
          className="z-50 flex justify-between bg-[#021526] px-4 py-3 shadow-sm md:px-4"
        >
          <div
            className={`flex items-center text-neutral-400 ${!isCollapsed ? 'gap-2' : ''}`}
          >
            <GiBurningBook
              className={`transition-all ${isCollapsed ? 'h-6 w-6' : 'h-8 w-8'} `}
            />

            <div
              className={`flex flex-col justify-end truncate ${isCollapsed ? 'invisible w-0' : 'visible w-auto'}`}
            >
              <Logo />
            </div>
          </div>

          {/* Toggle Button in mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened(prev => !prev)}
          >
            {navOpened ? <X /> : <Menu />}
          </Button>
        </Layout.Header>

        {/* Navigation links */}
        <Nav
          id="sidebar-menu"
          className={`z-40 h-full flex-1 overflow-auto bg-[#021526] text-neutral-400 ${navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:p-2'}`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={sidelinks}
        />

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed(prev => !prev)}
          size="icon"
          variant="outline"
          className="absolute -right-5 top-1/2 z-50 hidden rounded-full md:inline-flex"
        >
          <ChevronsLeft
            // stroke={1.5}
            className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </Button>
      </Layout>
    </aside>
  )
}
