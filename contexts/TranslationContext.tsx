'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// Import translations statically
import enTranslations from '@/messages/en.json'
import frTranslations from '@/messages/fr.json'
import arTranslations from '@/messages/ar.json'

type Locale = 'en' | 'fr' | 'ar'

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

const translations: Record<Locale, Record<string, any>> = {
  en: enTranslations,
  fr: frTranslations,
  ar: arTranslations,
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && ['en', 'fr', 'ar'].includes(savedLocale)) {
      setLocaleState(savedLocale)
    }
  }, [])

  const translationsData = translations[locale] || translations.en

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (mounted) {
      localStorage.setItem('locale', newLocale)
    }
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translationsData
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) return key
    }
    return typeof value === 'string' ? value : key
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  // Always provide the context, even before mount to prevent errors
  return (
    <TranslationContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}

