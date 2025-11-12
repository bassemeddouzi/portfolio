'use client'

import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/contexts/TranslationContext'

export default function Hero() {
  const { t, dir } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState<string | null>(null)
  const [jobTitle, setJobTitle] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    // Charger le nom depuis la base de données
    fetch('/api/about')
      .then((res) => res.json())
      .then((about) => {
        if (about.name) setName(about.name)
        if (about.jobTitle) setJobTitle(about.jobTitle)
      })
      .catch(() => {})
  }, [])

  const [socialLinks, setSocialLinks] = useState([
    { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FaEnvelope, href: 'mailto:contact@example.com', label: 'Email' },
  ])

  useEffect(() => {
    // Charger les liens sociaux depuis les paramètres
    fetch('/api/settings')
      .then((res) => res.json())
      .then((settings) => {
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
    <section
      id="accueil"
      className="min-h-screen flex items-center justify-center pt-20"
      style={{
        background: 'var(--gradient-hero, linear-gradient(to bottom right, rgba(14, 165, 233, 0.1), white, rgba(14, 165, 233, 0.1)))',
      }}
      dir={dir}
    >
      <div className="section-container text-center">
        <div
          className={`space-y-6 ${
            mounted ? 'animate-fade-in' : 'opacity-0'
          }`}
        >
          <div className="inline-block">
            <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-semibold">
              {jobTitle || t('hero.role')}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            {t('hero.title')}
            <br />
            <span className="text-primary-600 dark:text-primary-400">
              {name || 'Votre Nom'}
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a href="#contact" className="btn-primary">
              {t('hero.contactBtn')}
            </a>
            <a
              href="/cv.pdf"
              download
              className="btn-secondary flex items-center gap-2"
            >
              <FaDownload />
              {t('hero.downloadCv')}
            </a>
          </div>

          <div className="flex justify-center gap-6 pt-8">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
                aria-label={label}
              >
                <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

