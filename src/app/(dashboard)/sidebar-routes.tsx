'use client'

import { Compass, Layout } from 'lucide-react'
import { usePathname } from 'next/navigation'

import SidebarItem from './sidebar-item'

const SidebarRoutes = () => {
  const pathname = usePathname()

  const guestRoutes = [
    {
      icon: Layout,
      label: 'Dashboard',
      href: '/',
    },
    { icon: Compass, label: 'Browse', href: '/search' },
  ]

  return (
    <div className="flex w-full flex-col">
      {guestRoutes.map(route => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}

export default SidebarRoutes
