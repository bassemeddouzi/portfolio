'use client'

import { useMemo } from 'react'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { useTranslation } from '@/contexts/TranslationContext'
import { useSiteSettings } from '@/components/SettingsProvider'

export default function Footer() {
  const { t, dir } = useTranslation()
  const { settings } = useSiteSettings()
  const currentYear = new Date().getFullYear()

  const siteName = settings.raw.siteName || 'Portfolio'

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

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 dark:text-gray-400 py-8" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm">
              © {currentYear} {siteName}. {t('footer.rights')}
            </p>
          </div>

          <div className="flex gap-6">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-500 hover:text-primary-400 dark:hover:text-primary-400 transition-colors duration-300"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
