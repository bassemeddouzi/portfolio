'use client'

import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSave, FaTimes } from 'react-icons/fa'

interface Experience {
  id?: number
  title: string
  company: string
  period: string
  description: string[]
  order?: number
}

export default function ExperiencesAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Experience>({
    title: '',
    company: '',
    period: '',
    description: [''],
    order: 0,
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experiences')
      if (res.ok) {
        const data = await res.json()
        setExperiences(data)
      }
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const description = formData.description.filter((d) => d.trim() !== '')

    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = { ...formData, description, id: editingId }

      const res = await fetch('/api/experiences', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setMessage({ type: 'success', text: editingId ? 'Expérience mise à jour !' : 'Expérience ajoutée !' })
        fetchExperiences()
        resetForm()
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
    } finally {
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleEdit = (exp: Experience) => {
    setFormData(exp)
    setEditingId(exp.id || null)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) return

    try {
      const res = await fetch(`/api/experiences?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Expérience supprimée !' })
        fetchExperiences()
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la suppression' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' })
    } finally {
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const resetForm = () => {
    setFormData({ title: '', company: '', period: '', description: [''], order: 0 })
    setEditingId(null)
    setShowForm(false)
  }

  const addDescriptionLine = () => {
    setFormData({ ...formData, description: [...formData.description, ''] })
  }

  const removeDescriptionLine = (index: number) => {
    setFormData({
      ...formData,
      description: formData.description.filter((_, i) => i !== index),
    })
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gérer - Expérience</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <FaPlus />
            Ajouter
          </button>
        </div>

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

        {showForm && (
          <div className="card mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingId ? 'Modifier' : 'Ajouter'} une expérience
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du poste
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Période
                  </label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="2020 - 2022"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordre
                  </label>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (une ligne par point)
                </label>
                {formData.description.map((desc, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={desc}
                      onChange={(e) => {
                        const newDesc = [...formData.description]
                        newDesc[index] = e.target.value
                        setFormData({ ...formData, description: newDesc })
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder={`Point ${index + 1}`}
                    />
                    {formData.description.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDescriptionLine(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDescriptionLine}
                  className="text-sm text-primary-600 hover:text-primary-700 mt-2"
                >
                  + Ajouter une ligne
                </button>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <FaSave />
                  Sauvegarder
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {experiences.length === 0 ? (
            <div className="card text-center text-gray-500">
              Aucune expérience ajoutée
            </div>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{exp.title}</h3>
                    <p className="text-primary-600 font-semibold">{exp.company}</p>
                    <p className="text-gray-600 text-sm">{exp.period}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => exp.id && handleDelete(exp.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <ul className="space-y-1">
                  {exp.description.map((desc, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-primary-600 mt-1.5">▸</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

