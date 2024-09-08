'use client'

import { QueryProvider } from '@/providers/query-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  return <QueryProvider>{children}</QueryProvider>
}
