'use client'

import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSave, FaTimes } from 'react-icons/fa'

interface Skill {
  id?: number
  name: string
  level: number
  category: 'Frontend' | 'Backend' | 'Outils & Technologies'
  icon?: string
  order?: number
}

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Skill>({
    name: '',
    level: 0,
    category: 'Frontend',
    icon: '',
    order: 0,
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills')
      if (res.ok) {
        const data = await res.json()
        setSkills(data)
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = { ...formData, id: editingId }

      const res = await fetch('/api/skills', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setMessage({ type: 'success', text: editingId ? 'Compétence mise à jour !' : 'Compétence ajoutée !' })
        fetchSkills()
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

  const handleEdit = (skill: Skill) => {
    setFormData(skill)
    setEditingId(skill.id || null)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) return

    try {
      const res = await fetch(`/api/skills?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Compétence supprimée !' })
        fetchSkills()
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
    setFormData({ name: '', level: 0, category: 'Frontend', icon: '', order: 0 })
    setEditingId(null)
    setShowForm(false)
  }

  const categories = ['Frontend', 'Backend', 'Outils & Technologies']

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
          <h1 className="text-3xl font-bold text-gray-900">Gérer - Compétences</h1>
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
                {editingId ? 'Modifier' : 'Ajouter'} une compétence
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Skill['category'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau (0-100)
                  </label>
                  <input
                    type="number"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    min="0"
                    max="100"
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

        <div className="space-y-6">
          {categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category)
            return (
              <div key={category} className="card">
                <h3 className="text-xl font-bold mb-4">{category}</h3>
                <div className="space-y-3">
                  {categorySkills.length === 0 ? (
                    <p className="text-gray-500">Aucune compétence</p>
                  ) : (
                    categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-gray-500">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => skill.id && handleDelete(skill.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

