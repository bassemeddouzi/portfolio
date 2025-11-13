'use client'

import { useState, useEffect } from 'react'
import { FaReact, FaNodeJs, FaGitAlt } from 'react-icons/fa'
import { useTranslation } from '@/contexts/TranslationContext'
import { useSiteSettings } from '@/components/SettingsProvider'

interface Skill {
  id: number
  name: string
  level: number
  category: 'Frontend' | 'Backend' | 'Outils & Technologies'
  icon?: string
}

const categoryIcons: Record<string, typeof FaReact> = {
  Frontend: FaReact,
  Backend: FaNodeJs,
  'Outils & Technologies': FaGitAlt,
}

export default function Skills() {
  const { t, dir } = useTranslation()
  const { settings } = useSiteSettings()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!settings.sections.skills) {
      setSkills([])
      setLoading(false)
      return
    }

    setLoading(true)
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => setSkills(data || []))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false))
  }, [settings.sections.skills])

  const categories: Array<'Frontend' | 'Backend' | 'Outils & Technologies'> = [
    'Frontend',
    'Backend',
    'Outils & Technologies',
  ]

  const groupedSkills = categories.map((category) => ({
    category,
    skills: skills.filter((s) => s.category === category),
  }))

  if (!settings.sections.skills) {
    return null
  }

  if (loading) {
    return (
      <section id="competences" className="section-container bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse">Chargement...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="competences" className="section-container bg-gray-50 dark:bg-gray-900" dir={dir}>
      <h2 className="section-title">{t('skills.title')}</h2>
      <p className="section-subtitle">
        {t('skills.subtitle')}
      </p>

      {skills.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
          Aucune compétence disponible
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {groupedSkills.map((group, index) => {
            const Icon = categoryIcons[group.category] || FaReact
            return (
              <div key={index} className="card">
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="h-8 w-8 text-primary-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    {group.category}
                  </h3>
                </div>
                <div className="space-y-4">
                  {group.skills.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aucune compétence</p>
                  ) : (
                    group.skills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {skill.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-primary-600 h-2.5 rounded-full transition-all duration-1000"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

