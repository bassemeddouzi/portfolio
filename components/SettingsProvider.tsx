'use client'

import { usePrimaryColor } from '@/hooks/usePrimaryColor'

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  usePrimaryColor()
  return <>{children}</>
}

