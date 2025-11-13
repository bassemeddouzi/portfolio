'use client'

import { useMemo, useState, useEffect } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useTranslation } from '@/contexts/TranslationContext'
import LanguageSelector from './LanguageSelector'
import ThemeToggle from './ThemeToggle'
import { useSiteSettings } from '@/components/SettingsProvider'

type SectionKey = 'hero' | 'skills' | 'experience' | 'projects' | 'contact'

export default function Navbar() {
  const { t, dir } = useTranslation()
  const { settings } = useSiteSettings()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const siteName = settings.raw.siteName || 'Portfolio'

  const navLinks = useMemo(
    () =>
      [
        { href: '#accueil', label: t('nav.home'), section: 'hero' as SectionKey },
        { href: '#competences', label: t('nav.skills'), section: 'skills' as SectionKey },
        { href: '#experience', label: t('nav.experience'), section: 'experience' as SectionKey },
        { href: '#projets', label: t('nav.projects'), section: 'projects' as SectionKey },
        { href: '#contact', label: t('nav.contact'), section: 'contact' as SectionKey },
      ].filter((link) => settings.sections[link.section]),
    [settings.sections, t]
  )

  const homeHref = navLinks[0]?.href ?? '#accueil'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white dark:bg-gray-900 shadow-md'
          : 'bg-transparent dark:bg-transparent'
      }`}
      dir={dir}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <a
            href={homeHref}
            className="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400"
          >
            {siteName}
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 font-medium"
              >
                {link.label}
              </a>
            ))}
            <LanguageSelector />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
            <button
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

