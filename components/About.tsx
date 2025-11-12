'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/contexts/TranslationContext'

interface AboutData {
  name?: string
  jobTitle?: string
  title: string
  description: string
  imageUrl?: string
  stats?: {
    projects?: number
    experience?: number
    clients?: number
    showProjects?: boolean
    showExperience?: boolean
    showClients?: boolean
  }
}

export default function About() {
  const { t, dir } = useTranslation()
  const [data, setData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/about')
      .then((res) => res.json())
      .then((about) => {
        if (about.id) {
          setData(about)
        } else {
          // Données par défaut si aucune donnée en base
          setData({
            title: 'À propos de moi',
            description: 'Je suis un développeur fullstack JavaScript passionné par la création d\'applications web modernes et performantes.',
            stats: { projects: 50, experience: 5, clients: 30 },
          })
        }
      })
      .catch(() => {
        // Données par défaut en cas d'erreur
        setData({
          title: t('about.title'),
          description: t('about.subtitle'),
          stats: { projects: 50, experience: 5, clients: 30 },
        })
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return (
      <section id="a-propos" className="section-container bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">Chargement...</div>
        </div>
      </section>
    )
  }

  const paragraphs = data.description.split('\n').filter((p) => p.trim())

  return (
    <section id="a-propos" className="section-container bg-white dark:bg-gray-900" dir={dir}>
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">{data.title || t('about.title')}</h2>
        {data.name && (
          <h3 className="text-2xl font-bold text-center mb-2 text-primary-600 dark:text-primary-400">
            {data.name}
          </h3>
        )}
        {data.jobTitle && (
          <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-4">
            {data.jobTitle}
          </p>
        )}
        <p className="section-subtitle">
          {t('about.subtitle')}
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, index) => <p key={index}>{p}</p>)
            ) : (
              <p>{data.description}</p>
            )}
          </div>

          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            {data.imageUrl ? (
              <img
                src={data.imageUrl}
                alt="Photo de profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: 'var(--gradient-about, linear-gradient(to bottom right, #38bdf8, #0ea5e9))',
                }}
              >
                <span className="text-white text-6xl font-bold">
                  {data.title?.charAt(0) || 'VN'}
                </span>
              </div>
            )}
          </div>
        </div>

        {(data.stats?.showProjects || data.stats?.showExperience || data.stats?.showClients) && (
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {data.stats?.showProjects && (
              <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {data.stats?.projects || 0}+
                </div>
                <div className="text-gray-600 dark:text-gray-400">{t('about.projects')}</div>
              </div>
            )}
            {data.stats?.showExperience && (
              <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {data.stats?.experience || 0}+
                </div>
                <div className="text-gray-600 dark:text-gray-400">{t('about.experience')}</div>
              </div>
            )}
            {data.stats?.showClients && (
              <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {data.stats?.clients || 0}+
                </div>
                <div className="text-gray-600 dark:text-gray-400">{t('about.clients')}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

