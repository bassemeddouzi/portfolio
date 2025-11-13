'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type PortfolioTheme = 'modern' | 'classic' | 'minimal' | 'bold'

type SectionVisibilityKey = 'hero' | 'skills' | 'experience' | 'projects' | 'contact'

interface SectionVisibility {
  hero: boolean
  skills: boolean
  experience: boolean
  projects: boolean
  contact: boolean
}

interface SiteSettings {
  primaryColor: string
  siteName: string
  theme: PortfolioTheme
  sections: SectionVisibility
  raw: Record<string, string>
}

interface SettingsContextValue {
  settings: SiteSettings
  loading: boolean
  refresh: () => Promise<void>
}

const defaultSections: SectionVisibility = {
  hero: true,
  skills: true,
  experience: true,
  projects: true,
  contact: true,
}

const defaultSettings: SiteSettings = {
  primaryColor: '#0ea5e9',
  siteName: 'Portfolio',
  theme: 'modern',
  sections: defaultSections,
  raw: {},
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  loading: true,
  refresh: async () => {},
})

interface ThemePreset {
  label: string
  fontFamily: string
  headingFontFamily: string
  bodyBackground: string
  bodyBackgroundDark: string
  textColor: string
  textColorDark: string
  headingTransform?: string
  headingLetterSpacing?: string
}

const themePresets: Record<PortfolioTheme, ThemePreset> = {
  modern: {
    label: 'Moderne',
    fontFamily: `'Inter', 'Segoe UI', sans-serif`,
    headingFontFamily: `'Poppins', 'Segoe UI', sans-serif`,
    bodyBackground: '#f8fafc',
    bodyBackgroundDark: '#0f172a',
    textColor: '#0f172a',
    textColorDark: '#f8fafc',
    headingTransform: 'none',
  },
  classic: {
    label: 'Classique',
    fontFamily: `'Georgia', 'Times New Roman', serif`,
    headingFontFamily: `'Playfair Display', 'Georgia', serif`,
    bodyBackground: '#fffdf5',
    bodyBackgroundDark: '#1f2937',
    textColor: '#1f2937',
    textColorDark: '#f3f4f6',
    headingTransform: 'none',
    headingLetterSpacing: '0.04em',
  },
  minimal: {
    label: 'Minimal',
    fontFamily: `'Helvetica Neue', Helvetica, Arial, sans-serif`,
    headingFontFamily: `'Helvetica Neue', Helvetica, Arial, sans-serif`,
    bodyBackground: '#ffffff',
    bodyBackgroundDark: '#111827',
    textColor: '#111827',
    textColorDark: '#f9fafb',
    headingTransform: 'uppercase',
    headingLetterSpacing: '0.08em',
  },
  bold: {
    label: 'Bold',
    fontFamily: `'Montserrat', 'Segoe UI', sans-serif`,
    headingFontFamily: `'Montserrat', 'Segoe UI', sans-serif`,
    bodyBackground: '#edf2ff',
    bodyBackgroundDark: '#0b1120',
    textColor: '#0b1120',
    textColorDark: '#e0e7ff',
    headingTransform: 'none',
  },
}

const parseBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback
  return value === 'true' || value === '1'
}

const applyPrimaryColor = (color: string) => {
  if (!color) return
  document.documentElement.style.setProperty('--primary-color', color)

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  const rgb = hexToRgb(color)
  if (!rgb) return

  const lighter = `rgb(${Math.min(255, rgb.r + 40)}, ${Math.min(255, rgb.g + 40)}, ${Math.min(255, rgb.b + 40)})`
  const darker = `rgb(${Math.max(0, rgb.r - 40)}, ${Math.max(0, rgb.g - 40)}, ${Math.max(0, rgb.b - 40)})`

  const light10 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
  const light20 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`
  const light30 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`

  document.documentElement.style.setProperty('--primary-color-light', lighter)
  document.documentElement.style.setProperty('--primary-color-dark', darker)
  document.documentElement.style.setProperty('--primary-color-50', light10)
  document.documentElement.style.setProperty('--primary-color-100', light20)
  document.documentElement.style.setProperty('--primary-color-200', light30)
  document.documentElement.style.setProperty('--gradient-hero', `linear-gradient(to bottom right, ${light10}, white, ${light10})`)
  document.documentElement.style.setProperty('--gradient-project', `linear-gradient(to bottom right, ${lighter}, ${color})`)
  document.documentElement.style.setProperty('--gradient-about', `linear-gradient(to bottom right, ${lighter}, ${color})`)
}

const applyThemePreset = (theme: PortfolioTheme) => {
  const preset = themePresets[theme] || themePresets.modern
  document.documentElement.style.setProperty('--theme-font-family', preset.fontFamily)
  document.documentElement.style.setProperty('--theme-heading-font-family', preset.headingFontFamily)
  document.documentElement.style.setProperty('--theme-body-bg', preset.bodyBackground)
  document.documentElement.style.setProperty('--theme-body-bg-dark', preset.bodyBackgroundDark)
  document.documentElement.style.setProperty('--theme-text-color', preset.textColor)
  document.documentElement.style.setProperty('--theme-text-color-dark', preset.textColorDark)
  document.documentElement.style.setProperty(
    '--theme-heading-transform',
    preset.headingTransform || 'none'
  )
  document.documentElement.style.setProperty(
    '--theme-heading-letter-spacing',
    preset.headingLetterSpacing || 'normal'
  )
}

const mapSettings = (raw: Record<string, string>): SiteSettings => {
  const sections: SectionVisibility = {
    hero: parseBoolean(raw['section.hero'], defaultSections.hero),
    skills: parseBoolean(raw['section.skills'], defaultSections.skills),
    experience: parseBoolean(raw['section.experience'], defaultSections.experience),
    projects: parseBoolean(raw['section.projects'], defaultSections.projects),
    contact: parseBoolean(raw['section.contact'], defaultSections.contact),
  }

  const theme = (raw['portfolioTheme'] as PortfolioTheme) || defaultSettings.theme

  return {
    primaryColor: raw.primaryColor || defaultSettings.primaryColor,
    siteName: raw.siteName || defaultSettings.siteName,
    theme: themePresets[theme] ? theme : defaultSettings.theme,
    sections,
    raw,
  }
}

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      if (!res.ok) throw new Error('Failed to load settings')
      const data = await res.json()
      const parsed = mapSettings(data)
      setSettings(parsed)
      applyPrimaryColor(parsed.primaryColor)
      applyThemePreset(parsed.theme)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const contextValue = useMemo(
    () => ({
      settings,
      loading,
      refresh: fetchSettings,
    }),
    [settings, loading, fetchSettings]
  )

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>
}

export const useSiteSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSiteSettings must be used within SettingsProvider')
  }
  return context
}

