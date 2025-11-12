'use client'

import { useTranslation } from '@/contexts/TranslationContext'
import { useEffect, useState } from 'react'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { dir, locale } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('dir', dir)
      document.documentElement.setAttribute('lang', locale)
    }
  }, [dir, locale, mounted])

  return <>{children}</>
}

