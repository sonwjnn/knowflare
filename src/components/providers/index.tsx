'use client'

import { Modals } from '@/components/providers/modals'
import { ThemeProvider } from 'next-themes'

import { ConfettiProvider } from './conffeti-provider'
import { JotaiProvider } from './jotai-provider'
import { QueryProvider } from './query-provider'
import { SheetProvider } from './sheet-provider'
import { ToastProvider } from './toast-provider'
import { TopLoaderProvider } from './top-loader-provider'

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
          <TopLoaderProvider />
          <SheetProvider />
          <ToastProvider />
          <Modals />
          <ConfettiProvider />
          {children}
        </ThemeProvider>
      </QueryProvider>
    </JotaiProvider>
  )
}
