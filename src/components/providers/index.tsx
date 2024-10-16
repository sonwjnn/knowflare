'use client'

import { ThemeProvider } from 'next-themes'

import { ConfettiProvider } from './conffeti-provider'
import { JotaiProvider } from './jotai-provider'
import { QueryProvider } from './query-provider'
import { SheetProvider } from './sheet-provider'

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
          <SheetProvider />
          <ConfettiProvider />
          {children}
        </ThemeProvider>
      </QueryProvider>
    </JotaiProvider>
  )
}
