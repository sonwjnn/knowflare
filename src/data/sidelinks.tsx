import {
  AlertCircle,
  AppWindow,
  Ban,
  BarChart2,
  CheckSquare,
  Component,
  FileX,
  Hexagon,
  LayoutDashboard,
  Lock,
  MessageSquare,
  Package,
  Route,
  ServerOff,
  Settings,
  Shield,
  Truck,
  Users,
} from 'lucide-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/admin',
    icon: <LayoutDashboard size={18} />,
  },
  {
    title: 'Courses',
    label: '3',
    href: '/admin/courses',
    icon: <CheckSquare size={18} />,
  },
  {
    title: 'Users',
    label: '',
    href: '/admin/users',
    icon: <Users size={18} />,
  },
  {
    title: 'Chats',
    label: '9',
    href: '/admin/chats',
    icon: <MessageSquare size={18} />,
  },
  {
    title: 'Requests',
    label: '10',
    href: '/admin/requests',
    icon: <Route size={18} />,
    sub: [
      {
        title: 'Trucks',
        label: '9',
        href: '/trucks',
        icon: <Truck size={18} />,
      },
      {
        title: 'Cargos',
        label: '',
        href: '/admin/cargos',
        icon: <Package size={18} />,
      },
    ],
  },
  {
    title: 'Analysis',
    label: '',
    href: '/admin/analysis',
    icon: <BarChart2 size={18} />,
  },

  {
    title: 'Settings',
    label: '',
    href: '/admin/settings',
    icon: <Settings size={18} />,
  },
]
