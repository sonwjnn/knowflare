import { usePathname } from 'next/navigation'

export default function useCheckActiveNav() {
  const pathname = usePathname()

  const checkActiveNav = (nav: string) => {
    if (nav === '/' && (pathname.includes('/dashboard') || pathname === '/'))
      return true

    return pathname === nav
  }

  return { checkActiveNav }
}
