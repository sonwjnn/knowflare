import {
    AlertCircle,
    AlignHorizontalJustifyEnd,
    AppWindow,
    Ban,
    BarChart2,
    CheckSquare,
    Component,
    Database,
    DatabaseBackup,
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
    Ticket,
    Truck,
    Users,
} from 'lucide-react'
import { BsCollectionPlay } from 'react-icons/bs'

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
        title: 'Categories',
        href: '/admin/categories',
        icon: <AlignHorizontalJustifyEnd size={18} />,
    },
    {
        title: 'Courses',
        href: '/admin/courses',
        icon: <BsCollectionPlay size={18} />,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: <Users size={18} />,
    },
    //   {
    //     title: 'Chats',
    //     href: '/admin/chats',
    //     icon: <MessageSquare size={18} />,
    //   },
    // {
    //   title: 'Requests',
    //   href: '/admin/requests',
    //   icon: <Route size={18} />,
    //   sub: [
    //     {
    //       title: 'Trucks',
    //       label: '9',
    //       href: '/trucks',
    //       icon: <Truck size={18} />,
    //     },
    //     {
    //       title: 'Cargos',
    //       label: '',
    //       href: '/admin/cargos',
    //       icon: <Package size={18} />,
    //     },
    //   ],
    // },
    {
        title: 'Analysis',
        label: '',
        href: '/admin/analysis',
        icon: <BarChart2 size={18} />,
    },

    {
        title: 'Coupons',
        label: '',
        href: '/admin/coupons',
        icon: <Ticket size={18} />,
    },

    //   {
    //     title: 'Settings',
    //     label: '',
    //     href: '/admin/settings',
    //     icon: <Settings size={18} />,
    //   },
    {
        title: 'Backup & Restore',
        label: '',
        href: '/admin/backups',
        icon: <DatabaseBackup size={18} />,
    },
]
