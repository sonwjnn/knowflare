'use client'

import { Layout } from '@/components/custom/layout'
import { Search } from '@/features/admin/components/search'
import { UserButton } from '@/features/auth/components/user-button'
import { useIsCollapsedStore } from '@/store/use-is-collapsed'
import { useEffect, useState } from 'react'

import { Sidebar } from './sidebar'

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useIsCollapsedStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative h-full overflow-hidden bg-background">
      {/* <SkipToMain /> */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id="content"
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <Layout>
          {/* ===== Top Heading ===== */}
          <Layout.Header sticky>
            <Search />
            <div className="ml-auto flex items-center space-x-4">
              {/* <ThemeSwitch /> */}
              <UserButton />
            </div>
          </Layout.Header>
          <Layout.Body>{children}</Layout.Body>
        </Layout>
      </main>
    </div>
  )
}
