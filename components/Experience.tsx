'use client'

import { useState, useEffect } from 'react'
import { FaBriefcase, FaCalendarAlt } from 'react-icons/fa'
import { useTranslation } from '@/contexts/TranslationContext'

interface Experience {
  id: number
  title: string
  company: string
  period: string
  description: string[]
}

export default function Experience() {
  const { t, dir } = useTranslation()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/experiences')
      .then((res) => res.json())
      .then((data) => {
        setExperiences(data || [])
      })
      .catch(() => {
        setExperiences([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section id="experience" className="section-container bg-white">
        <div className="text-center">
          <div className="animate-pulse">Chargement...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="section-container bg-white dark:bg-gray-900" dir={dir}>
      <h2 className="section-title">{t('experience.title')}</h2>
      <p className="section-subtitle">
        {t('experience.subtitle')}
      </p>

      {experiences.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
          Aucune expérience disponible
        </div>
      ) : (
        <div className="max-w-4xl mx-auto mt-12">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200 hidden md:block" />

            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-6 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-md hidden md:block" />

                  <div className="md:ml-20 card">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div className="flex items-center gap-2 mb-2 sm:mb-0">
                        <FaBriefcase className="text-primary-600 dark:text-primary-400" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {exp.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaCalendarAlt className="text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-medium">{exp.period}</span>
                      </div>
                    </div>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold mb-3">
                      {exp.company}
                    </p>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      {exp.description.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <span className="text-primary-600 mt-1.5">▸</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

