'use client'

import { cn } from '@/lib/utils'
import {
  CircleUser,
  Cog,
  HelpCircle,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sidebarItems = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    href: '/my-profile',
  },
  {
    label: 'Personal Information',
    icon: CircleUser,
    href: '/my-profile/settings',
  },
  {
    label: 'Password and Security',
    icon: ShieldCheck,
    href: '/my-profile/password',
  },
]

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-[300px] flex-col border-r bg-white">
      <div className="flex flex-col space-y-1 border-b p-8">
        <h2 className="text-xl font-semibold">Profile Settings</h2>
        {/* <p className="text-sm text-muted-foreground">
          Manage your account preferences
        </p> */}
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-6">
        {sidebarItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-x-3 rounded-lg px-4 py-3.5 text-sm font-medium transition-all hover:bg-slate-100/80',
              pathname === item.href
                ? 'bg-slate-100 text-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
