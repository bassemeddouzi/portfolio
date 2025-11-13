'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  FaSave,
  FaSpinner,
  FaPalette,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa'
import { useSiteSettings } from '@/components/SettingsProvider'

type PortfolioTheme = 'modern' | 'classic' | 'minimal' | 'bold'

interface SectionVisibility {
  hero: boolean
  skills: boolean
  experience: boolean
  projects: boolean
  contact: boolean
}

interface SettingsData {
  primaryColor: string
  siteName: string
  contactEmail: string
  contactPhone: string
  contactLocation: string
  githubUrl: string
  linkedinUrl: string
  emailUrl: string
  portfolioTheme: PortfolioTheme
  sections: SectionVisibility
}

const defaultSettings: SettingsData = {
  primaryColor: '#0ea5e9',
  siteName: 'Portfolio',
  contactEmail: 'contact@example.com',
  contactPhone: '+33 6 12 34 56 78',
  contactLocation: 'Paris, France',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  emailUrl: 'mailto:contact@example.com',
  portfolioTheme: 'modern',
  sections: {
    hero: true,
    skills: true,
    experience: true,
    projects: true,
    contact: true,
  },
}

const themeOptions: Array<{
  id: PortfolioTheme
  name: string
  description: string
  previewClass: string
}> = [
  {
    id: 'modern',
    name: 'Moderne',
    description: 'Typographie contemporaine et mise en page équilibrée.',
    previewClass: 'bg-gradient-to-br from-sky-50 to-white text-slate-800',
  },
  {
    id: 'classic',
    name: 'Classique',
    description: 'Style élégant avec caractères serif et ambiance chaleureuse.',
    previewClass: 'bg-gradient-to-br from-amber-50 to-white text-stone-800',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Design épuré et hiérarchie typographique marquée.',
    previewClass: 'bg-gradient-to-br from-zinc-50 to-white text-zinc-900 uppercase tracking-wider',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Contrastes affirmés et typographie énergique.',
    previewClass: 'bg-gradient-to-br from-indigo-100 to-white text-slate-900',
  },
]

const themePresets: Record<
  PortfolioTheme,
  {
    fontFamily: string
    headingFontFamily: string
    bodyBackground: string
    bodyBackgroundDark: string
    textColor: string
    textColorDark: string
    headingTransform?: string
    headingLetterSpacing?: string
  }
> = {
  modern: {
    fontFamily: `'Inter', 'Segoe UI', sans-serif`,
    headingFontFamily: `'Poppins', 'Segoe UI', sans-serif`,
    bodyBackground: '#f8fafc',
    bodyBackgroundDark: '#0f172a',
    textColor: '#0f172a',
    textColorDark: '#f8fafc',
    headingTransform: 'none',
  },
  classic: {
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
    fontFamily: `'Montserrat', 'Segoe UI', sans-serif`,
    headingFontFamily: `'Montserrat', 'Segoe UI', sans-serif`,
    bodyBackground: '#edf2ff',
    bodyBackgroundDark: '#0b1120',
    textColor: '#0b1120',
    textColorDark: '#e0e7ff',
    headingTransform: 'none',
  },
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

const sectionsMeta: Array<{
  key: keyof SectionVisibility
  label: string
  description: string
}> = [
  {
    key: 'hero',
    label: 'Section Hero',
    description: 'Présentation principale avec le contenu À propos fusionné.',
  },
  {
    key: 'skills',
    label: 'Compétences',
    description: 'Liste vos compétences clés et niveaux de maîtrise.',
  },
  {
    key: 'experience',
    label: 'Expériences',
    description: 'Présente vos expériences professionnelles marquantes.',
  },
  {
    key: 'projects',
    label: 'Projets',
    description: 'Met en avant vos réalisations et projets récents.',
  },
  {
    key: 'contact',
    label: 'Contact',
    description: 'Affiche le formulaire et les informations pour vous contacter.',
  },
]

export default function SettingsAdminPage() {
  const { refresh } = useSiteSettings()
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings({
          primaryColor: data.primaryColor || defaultSettings.primaryColor,
          siteName: data.siteName || defaultSettings.siteName,
          contactEmail: data.contactEmail || defaultSettings.contactEmail,
          contactPhone: data.contactPhone || defaultSettings.contactPhone,
          contactLocation: data.contactLocation || defaultSettings.contactLocation,
          githubUrl: data.githubUrl || defaultSettings.githubUrl,
          linkedinUrl: data.linkedinUrl || defaultSettings.linkedinUrl,
          emailUrl: data.emailUrl || defaultSettings.emailUrl,
          portfolioTheme: (data.portfolioTheme as PortfolioTheme) || defaultSettings.portfolioTheme,
          sections: {
            hero: (data['section.hero'] ?? 'true') !== 'false',
            skills: (data['section.skills'] ?? 'true') !== 'false',
            experience: (data['section.experience'] ?? 'true') !== 'false',
            projects: (data['section.projects'] ?? 'true') !== 'false',
            contact: (data['section.contact'] ?? 'true') !== 'false',
          },
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const settingsArray = [
        ['primaryColor', settings.primaryColor],
        ['siteName', settings.siteName],
        ['contactEmail', settings.contactEmail],
        ['contactPhone', settings.contactPhone],
        ['contactLocation', settings.contactLocation],
        ['githubUrl', settings.githubUrl],
        ['linkedinUrl', settings.linkedinUrl],
        ['emailUrl', settings.emailUrl],
        ['portfolioTheme', settings.portfolioTheme],
        ['section.hero', String(settings.sections.hero)],
        ['section.skills', String(settings.sections.skills)],
        ['section.experience', String(settings.sections.experience)],
        ['section.projects', String(settings.sections.projects)],
        ['section.contact', String(settings.sections.contact)],
      ].map(([key, value]) => ({
        key,
        value: String(value ?? ''),
      }))

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsArray }),
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès !' })
        applyPrimaryColor(settings.primaryColor)
        refresh().catch(() => {})
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const applyPrimaryColor = (color: string) => {
    document.documentElement.style.setProperty('--primary-color', color)

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
  }

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

  useEffect(() => {
    if (settings.primaryColor) {
      applyPrimaryColor(settings.primaryColor)
    }
  }, [settings.primaryColor])

  useEffect(() => {
    applyThemePreset(settings.portfolioTheme)
  }, [settings.portfolioTheme])

  const activeTheme = useMemo(
    () => themeOptions.find((theme) => theme.id === settings.portfolioTheme) ?? themeOptions[0],
    [settings.portfolioTheme]
  )

  if (loading) {
    return (
      <div className="section-container">
        <div className="text-center">
          <FaSpinner className="animate-spin h-8 w-8 text-primary-600 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="section-container">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Paramètres du site
        </h1>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Apparence */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaPalette className="text-primary-600" />
              Apparence
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur primaire
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-20 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="#0ea5e9"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-300"
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Cette couleur sera utilisée pour les boutons, liens et éléments principaux du site.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Thème visuel
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Choisissez un style global pour la typographie, le fond et la mise en forme des textes.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {themeOptions.map((theme) => {
                    const isActive = theme.id === settings.portfolioTheme
                    return (
                      <button
                        type="button"
                        key={theme.id}
                        onClick={() => setSettings((prev) => ({ ...prev, portfolioTheme: theme.id }))}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                          isActive
                            ? 'border-primary-600 shadow-lg ring-2 ring-primary-200'
                            : 'border-gray-200 hover:border-primary-300 hover:shadow'
                        }`}
                      >
                        <div className={`rounded-lg p-4 mb-3 ${theme.previewClass}`}>
                          <p className="text-sm opacity-70">Aperçu</p>
                          <p className="text-lg font-semibold">Titre Exemple</p>
                          <p className="text-xs opacity-70">
                            Typographie et ambiance issues du thème.
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{theme.name}</h4>
                            <p className="text-sm text-gray-500">{theme.description}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-primary-600' : 'bg-gray-300'}`} />
                        </div>
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Thème actuel : {activeTheme.name}
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaEye className="text-primary-600" />
              Sections affichées
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Activez ou masquez les sections visibles sur le portfolio public.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {sectionsMeta.map(({ key, label, description }) => {
                const enabled = settings.sections[key]
                return (
                  <div
                    key={key}
                    className={`border rounded-lg p-4 transition ${
                      enabled ? 'border-primary-200 bg-white shadow-sm' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                      <button
                        type="button"
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            sections: {
                              ...prev.sections,
                              [key]: !prev.sections[key],
                            },
                          }))
                        }
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          enabled
                            ? 'bg-primary-50 text-primary-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {enabled ? <FaEye /> : <FaEyeSlash />}
                        {enabled ? 'Affiché' : 'Masqué'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Informations générales */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaUser className="text-primary-600" />
              Informations générales
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du site
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Portfolio"
              />
            </div>
          </div>

  {/* Informations de contact */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaEnvelope className="text-primary-600" />
              Informations de contact
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaEnvelope />
                  Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaPhone />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt />
                  Localisation
                </label>
                <input
                  type="text"
                  value={settings.contactLocation}
                  onChange={(e) => setSettings({ ...settings, contactLocation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Liens sociaux */}
          <div className="pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaGithub className="text-primary-600" />
              Liens sociaux
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaGithub />
                  GitHub
                </label>
                <input
                  type="url"
                  value={settings.githubUrl}
                  onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaLinkedin />
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={settings.linkedinUrl}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaEnvelope />
                  Email (lien)
                </label>
                <input
                  type="text"
                  value={settings.emailUrl}
                  onChange={(e) => setSettings({ ...settings, emailUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="mailto:contact@example.com"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <FaSave />
                Sauvegarder les paramètres
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
