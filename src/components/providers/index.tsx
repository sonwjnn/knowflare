'use client'

import { ThemeProvider } from 'next-themes'

import { JotaiProvider } from './jotai-provider'
import { QueryProvider } from './query-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <JotaiProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="app-theme"
        >
          {children}
        </ThemeProvider>
      </QueryProvider>
    </JotaiProvider>
  )
}
