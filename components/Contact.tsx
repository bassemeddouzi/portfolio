'use client'

import { useState, useMemo, FormEvent } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import { useTranslation } from '@/contexts/TranslationContext'
import { useSiteSettings } from '@/components/SettingsProvider'

export default function Contact() {
  const { t, dir } = useTranslation()
  const { settings } = useSiteSettings()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')

    // Simuler l'envoi du formulaire
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 3000)
    }, 1000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = useMemo(() => {
    const info: Array<{
      icon: typeof FaEnvelope
      label: string
      value: string
      href: string
    }> = []

    if (settings.raw.contactEmail) {
      info.push({
        icon: FaEnvelope,
        label: t('contact.email'),
        value: settings.raw.contactEmail,
        href: settings.raw.emailUrl || `mailto:${settings.raw.contactEmail}`,
      })
    }
    if (settings.raw.contactPhone) {
      info.push({
        icon: FaPhone,
        label: t('contact.phone'),
        value: settings.raw.contactPhone,
        href: `tel:${settings.raw.contactPhone.replace(/\s/g, '')}`,
      })
    }
    if (settings.raw.contactLocation) {
      info.push({
        icon: FaMapMarkerAlt,
        label: t('contact.location'),
        value: settings.raw.contactLocation,
        href: '#',
      })
    }

    return info
  }, [settings.raw, t])

  if (!settings.sections.contact) {
    return null
  }

  return (
    <section id="contact" className="section-container bg-white dark:bg-gray-900" dir={dir}>
      <h2 className="section-title">{t('contact.title')}</h2>
      <p className="section-subtitle">
        {t('contact.subtitle')}
      </p>

      <div className="max-w-6xl mx-auto mt-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {t('contact.contactInfo')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('contact.description')}
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <a
                    key={index}
                    href={info.href}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-300 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-600 dark:group-hover:bg-primary-500 transition-colors duration-300">
                      <Icon className="text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{info.label}</div>
                      <div className="text-gray-900 dark:text-gray-100 font-medium">
                        {info.value}
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300"
                  placeholder={t('contact.name')}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300"
                  placeholder={t('contact.email')}
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('contact.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300"
                  placeholder={t('contact.subject')}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300 resize-none"
                  placeholder={t('contact.message')}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending'
                  ? t('contact.sending')
                  : status === 'success'
                  ? t('contact.sent')
                  : t('contact.send')}
              </button>

              {status === 'error' && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                  {t('contact.error')}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

