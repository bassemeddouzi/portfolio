'use client'

import { useState, useEffect, useMemo } from 'react'
import { FaSave, FaSpinner, FaTrash, FaUpload } from 'react-icons/fa'

interface AboutStats {
  projects?: number
  experience?: number
  clients?: number
  showProjects?: boolean
  showExperience?: boolean
  showClients?: boolean
}

interface AboutData {
  id?: number
  name: string
  jobTitle: string
  title: string
  description: string
  stats: AboutStats
}

const createDefaultStats = (): AboutStats => ({
  projects: 0,
  experience: 0,
  clients: 0,
  showProjects: true,
  showExperience: true,
  showClients: true,
})

export default function AboutAdminPage() {
  const [data, setData] = useState<AboutData>({
    name: '',
    jobTitle: '',
    title: '',
    description: '',
    stats: createDefaultStats(),
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [removeImage, setRemoveImage] = useState(false)

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/about')
      if (res.ok) {
        const about = await res.json()
        setData({
          id: about.id,
          name: about.name || '',
          jobTitle: about.jobTitle || '',
          title: about.title || '',
          description: about.description || '',
          stats: {
            ...createDefaultStats(),
            ...about.stats,
          },
        })
        setImagePreview(about.imageSrc || about.imageUrl || null)
      } else {
        setData((prev) => ({
          ...prev,
          stats: createDefaultStats(),
        }))
      }
    } catch (error) {
      console.error('Error fetching about:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      setRemoveImage(false)
      setImagePreview((prev) => {
        if (prev && prev.startsWith('blob:')) {
          URL.revokeObjectURL(prev)
        }
        return URL.createObjectURL(file)
      })
    }
  }

  const handleRemoveImage = () => {
    setImagePreview((prev) => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev)
      }
      return null
    })
    setImageFile(null)
    setRemoveImage(true)
  }

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const statsEntries = useMemo(
    () => [
      {
        valueKey: 'projects' as const,
        toggleKey: 'showProjects' as const,
        label: 'Nombre de projets',
        toggleLabel: 'Afficher le compteur de projets',
      },
      {
        valueKey: 'experience' as const,
        toggleKey: 'showExperience' as const,
        label: "Années d'expérience",
        toggleLabel: "Afficher le compteur d'expérience",
      },
      {
        valueKey: 'clients' as const,
        toggleKey: 'showClients' as const,
        label: 'Clients satisfaits',
        toggleLabel: 'Afficher le compteur de clients',
      },
    ],
    []
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const method = data.id ? 'PUT' : 'POST'
      const formData = new FormData()

      if (data.id) formData.append('id', String(data.id))
      formData.append('name', data.name)
      formData.append('jobTitle', data.jobTitle)
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('stats', JSON.stringify(data.stats))

      if (imageFile) {
        formData.append('image', imageFile)
      } else if (removeImage) {
        formData.append('removeImage', 'true')
      }

      const res = await fetch('/api/about', {
        method,
        body: formData,
      })

      if (res.ok) {
        const saved = await res.json()
        setData({
          id: saved.id,
          name: saved.name || '',
          jobTitle: saved.jobTitle || '',
          title: saved.title || '',
          description: saved.description || '',
          stats: {
            ...createDefaultStats(),
            ...saved.stats,
          },
        })
        setImagePreview(saved.imageSrc || saved.imageUrl || null)
        setImageFile(null)
        setRemoveImage(false)
        setMessage({ type: 'success', text: 'Informations sauvegardées avec succès !' })
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
      }
    } catch (error) {
      console.error('Error saving about:', error)
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

          <div className="border rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Image de présentation
            </label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Aperçu de l'image"
                  className="w-full h-64 object-cover rounded-lg shadow"
                />
                <div className="flex gap-3 mt-3">
                  <label className="btn-secondary flex items-center gap-2 cursor-pointer">
                    <FaUpload />
                    Modifier l&apos;image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FaTrash />
                    Supprimer
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-lg py-10 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition">
                <FaUpload className="text-gray-400 text-3xl" />
                <span className="text-sm text-gray-600 text-center px-4">
                  Glissez-déposez une image ou cliquez pour sélectionner un fichier (PNG, JPG, WebP)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statistiques
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {statsEntries.map(({ valueKey, toggleKey, label, toggleLabel }) => (
                <div key={valueKey} className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id={`toggle-${valueKey}`}
                      checked={Boolean(data.stats[toggleKey])}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          stats: {
                            ...prev.stats,
                            [toggleKey]: e.target.checked,
                          },
                        }))
                      }
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor={`toggle-${valueKey}`} className="text-sm font-medium text-gray-700">
                      {toggleLabel}
                    </label>
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type="number"
                    value={Number(data.stats[valueKey] || 0)}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        stats: {
                          ...prev.stats,
                          [valueKey]: Number(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    min="0"
                  />
                </div>
              ))}
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

