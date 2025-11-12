'use client'

import { SessionProvider } from 'next-auth/react'
import { TranslationProvider } from '@/contexts/TranslationContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import SettingsProvider from '@/components/SettingsProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <TranslationProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </TranslationProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

