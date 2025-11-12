'use client'

import { useState, useEffect } from 'react'
import { FaSave, FaSpinner } from 'react-icons/fa'

interface AboutData {
  id?: number
  name: string
  jobTitle: string
  title: string
  description: string
  imageUrl: string
  stats: {
    projects?: number
    experience?: number
    clients?: number
    showProjects?: boolean
    showExperience?: boolean
    showClients?: boolean
  }
}

export default function AboutAdminPage() {
  const [data, setData] = useState<AboutData>({
    name: '',
    jobTitle: '',
    title: '',
    description: '',
    imageUrl: '',
    stats: {
      projects: 0,
      experience: 0,
      clients: 0,
      showProjects: true,
      showExperience: true,
      showClients: true,
    },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/about')
      if (res.ok) {
        const about = await res.json()
        setData({
          ...about,
          name: about.name || '',
          jobTitle: about.jobTitle || '',
          stats: {
            projects: about.stats?.projects || 0,
            experience: about.stats?.experience || 0,
            clients: about.stats?.clients || 0,
            showProjects: about.stats?.showProjects !== undefined ? about.stats.showProjects : true,
            showExperience: about.stats?.showExperience !== undefined ? about.stats.showExperience : true,
            showClients: about.stats?.showClients !== undefined ? about.stats.showClients : true,
          },
        })
      }
    } catch (error) {
      console.error('Error fetching about:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const method = data.id ? 'PUT' : 'POST'
      const body = { ...data, id: data.id }

      const res = await fetch('/api/about', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        const saved = await res.json()
        setData(saved)
        setMessage({ type: 'success', text: 'Informations sauvegardées avec succès !' })
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="section-container">
        <div className="text-center">
          <FaSpinner className="animate-spin h-8 w-8 text-primary-600 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="section-container">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Gérer - À propos
        </h1>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du poste
              </label>
              <input
                type="text"
                value={data.jobTitle}
                onChange={(e) => setData({ ...data, jobTitle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Ex: Développeur Fullstack"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la section
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de l&apos;image
            </label>
            <input
              type="url"
              value={data.imageUrl}
              onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statistiques
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="showProjects"
                    checked={data.stats.showProjects || false}
                    onChange={(e) =>
                      setData({
                        ...data,
                        stats: { ...data.stats, showProjects: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="showProjects" className="text-sm font-medium text-gray-700">
                    Afficher dans le portfolio
                  </label>
                </div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de projets
                </label>
                <input
                  type="number"
                  value={data.stats.projects || 0}
                  onChange={(e) =>
                    setData({
                      ...data,
                      stats: { ...data.stats, projects: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="showExperience"
                    checked={data.stats.showExperience || false}
                    onChange={(e) =>
                      setData({
                        ...data,
                        stats: { ...data.stats, showExperience: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="showExperience" className="text-sm font-medium text-gray-700">
                    Afficher dans le portfolio
                  </label>
                </div>
                <label className="block text-sm font-medium text-gray-700">
                  Années d&apos;expérience
                </label>
                <input
                  type="number"
                  value={data.stats.experience || 0}
                  onChange={(e) =>
                    setData({
                      ...data,
                      stats: { ...data.stats, experience: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="showClients"
                    checked={data.stats.showClients || false}
                    onChange={(e) =>
                      setData({
                        ...data,
                        stats: { ...data.stats, showClients: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="showClients" className="text-sm font-medium text-gray-700">
                    Afficher dans le portfolio
                  </label>
                </div>
                <label className="block text-sm font-medium text-gray-700">
                  Clients satisfaits
                </label>
                <input
                  type="number"
                  value={data.stats.clients || 0}
                  onChange={(e) =>
                    setData({
                      ...data,
                      stats: { ...data.stats, clients: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  min="0"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <FaSave />
                Sauvegarder
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

