'use client'

import { useState, useEffect } from 'react'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { useTranslation } from '@/contexts/TranslationContext'

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  demoUrl?: string
  imageUrl?: string
}

export default function Projects() {
  const { t, dir } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data || [])
      })
      .catch(() => {
        setProjects([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section id="projets" className="section-container bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse">Chargement...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="projets" className="section-container bg-gray-50 dark:bg-gray-900" dir={dir}>
      <h2 className="section-title">{t('projects.title')}</h2>
      <p className="section-subtitle">
        {t('projects.subtitle')}
      </p>

      {projects.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
          Aucun projet disponible
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {projects.map((project) => (
            <div key={project.id} className="card group">
              {/* Project Image */}
              <div 
                className="relative h-48 rounded-lg mb-4 overflow-hidden"
                style={{
                  background: 'var(--gradient-project, linear-gradient(to bottom right, #38bdf8, #0ea5e9))',
                }}
              >
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold opacity-50">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
                  >
                    <FaGithub />
                    {t('projects.code')}
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
                  >
                    <FaExternalLinkAlt />
                    {t('projects.demo')}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

