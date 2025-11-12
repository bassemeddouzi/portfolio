'use client'

import { useState, useEffect } from 'react'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { useTranslation } from '@/contexts/TranslationContext'

export default function Footer() {
  const { t, dir } = useTranslation()
  const currentYear = new Date().getFullYear()
  const [siteName, setSiteName] = useState('Portfolio')
  const [socialLinks, setSocialLinks] = useState([
    { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FaEnvelope, href: 'mailto:contact@example.com', label: 'Email' },
  ])

  useEffect(() => {
    // Charger les paramètres
    fetch('/api/settings')
      .then((res) => res.json())
      .then((settings) => {
        if (settings.siteName) {
          setSiteName(settings.siteName)
        }
        const links = []
        if (settings.githubUrl) {
          links.push({ icon: FaGithub, href: settings.githubUrl, label: 'GitHub' })
        }
        if (settings.linkedinUrl) {
          links.push({ icon: FaLinkedin, href: settings.linkedinUrl, label: 'LinkedIn' })
        }
        if (settings.emailUrl) {
          links.push({ icon: FaEnvelope, href: settings.emailUrl, label: 'Email' })
        }
        if (links.length > 0) {
          setSocialLinks(links)
        }
      })
      .catch(() => {})
  }, [])

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

