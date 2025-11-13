'use client'

import { useEffect, useMemo, useState } from 'react'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { useTranslation } from '@/contexts/TranslationContext'
import { useSiteSettings } from '@/components/SettingsProvider'

interface HeroStats {
  projects?: number
  experience?: number
  clients?: number
  showProjects?: boolean
  showExperience?: boolean
  showClients?: boolean
}

interface HeroContent {
  id?: number
  name?: string
  jobTitle?: string
  title?: string
  description?: string
  imageSrc?: string | null
  stats?: HeroStats
}

const defaultHeroContent: HeroContent = {
  name: '',
  jobTitle: '',
  title: '',
  description: '',
  imageSrc: null,
  stats: {
    projects: 0,
    experience: 0,
    clients: 0,
    showProjects: true,
    showExperience: true,
    showClients: true,
  },
}

export default function Hero() {
  const { t, dir } = useTranslation()
  const { settings } = useSiteSettings()
  const [content, setContent] = useState<HeroContent>(defaultHeroContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!settings.sections.hero) {
      setContent(defaultHeroContent)
      setLoading(false)
      return
    }

    setLoading(true)
    fetch('/api/about')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load about content')
        return res.json()
      })
      .then((about) => {
        setContent({
          id: about.id,
          name: about.name || defaultHeroContent.name,
          jobTitle: about.jobTitle || defaultHeroContent.jobTitle,
          title: about.title || defaultHeroContent.title,
          description: about.description || defaultHeroContent.description,
          imageSrc: about.imageSrc || about.imageUrl || null,
          stats: {
            ...defaultHeroContent.stats,
            ...about.stats,
          },
        })
      })
      .catch(() => {
        setContent(defaultHeroContent)
      })
      .finally(() => setLoading(false))
  }, [settings.sections.hero])

  const socialLinks = useMemo(() => {
    const links = []
    if (settings.raw.githubUrl) {
      links.push({ icon: FaGithub, href: settings.raw.githubUrl, label: 'GitHub' })
    }
    if (settings.raw.linkedinUrl) {
      links.push({ icon: FaLinkedin, href: settings.raw.linkedinUrl, label: 'LinkedIn' })
    }
    if (settings.raw.emailUrl) {
      links.push({ icon: FaEnvelope, href: settings.raw.emailUrl, label: 'Email' })
    }
    return links
  }, [settings.raw])

  if (!settings.sections.hero) {
    return null
  }

  const paragraphs = content.description
    ? content.description.split('\n').map((p) => p.trim()).filter(Boolean)
    : []

  const stats = content.stats || defaultHeroContent.stats

  return (
    <section
      id="accueil"
      dir={dir}
      className="min-h-screen flex items-center pt-24 bg-[var(--theme-body-bg)] dark:bg-[var(--theme-body-bg-dark)] transition-colors duration-500"
      style={{
        backgroundImage:
          'var(--gradient-hero, linear-gradient(to bottom right, rgba(14, 165, 233, 0.1), white, rgba(14, 165, 233, 0.1)))',
      }}
    >
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold tracking-wide uppercase">
              {loading ? t('hero.role') : content.jobTitle || t('hero.role')}
            </div>

            <div className="space-y-4">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight"
                style={{
                  letterSpacing: 'var(--theme-heading-letter-spacing)',
                  textTransform: 'var(--theme-heading-transform)',
                }}
              >
                {loading ? (
                  <span className="block bg-gray-200 dark:bg-gray-700 h-12 w-2/3 animate-pulse rounded" />
                ) : (
                  <>
                    {content.title || t('hero.title')}
                    {content.name && (
                      <>
                        <br />
                        <span className="text-primary-600 dark:text-primary-400">
                          {content.name}
                        </span>
                      </>
                    )}
                  </>
                )}
              </h1>

              <div className="text-base sm:text-lg text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed">
                {loading ? (
                  <>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                  </>
                ) : paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                ) : (
                  <p>{t('hero.subtitle')}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#contact" className="btn-primary">
                {t('hero.contactBtn')}
              </a>
              {socialLinks.length > 0 && (
                <div className="flex gap-4">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
                      aria-label={label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {(stats.showProjects || stats.showExperience || stats.showClients) && (
              <div className="grid sm:grid-cols-3 gap-4 pt-6">
                {stats.showProjects && (
                  <div className="rounded-lg bg-white/80 dark:bg-gray-800/60 p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {stats.projects ?? 0}+
                    </div>
                    <div className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1">
                      {t('about.projects')}
                    </div>
                  </div>
                )}
                {stats.showExperience && (
                  <div className="rounded-lg bg-white/80 dark:bg-gray-800/60 p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {stats.experience ?? 0}+
                    </div>
                    <div className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1">
                      {t('about.experience')}
                    </div>
                  </div>
                )}
                {stats.showClients && (
                  <div className="rounded-lg bg-white/80 dark:bg-gray-800/60 p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {stats.clients ?? 0}+
                    </div>
                    <div className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1">
                      {t('about.clients')}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative h-[360px] sm:h-[420px] lg:h-[460px] rounded-3xl overflow-hidden border border-white/60 dark:border-gray-800 shadow-xl bg-white/60 dark:bg-gray-800/40 backdrop-blur">
            {loading ? (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700" />
            ) : content.imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.imageSrc}
                alt={content.name || content.title || 'Portrait'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/30 dark:to-gray-900">
                <span className="text-7xl font-bold text-primary-600 dark:text-primary-400">
                  {(content.name || content.title || 'P')[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent dark:from-gray-900/60" />
          </div>
        </div>
      </div>
    </section>
  )
}
