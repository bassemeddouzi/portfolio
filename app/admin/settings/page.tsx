'use client'

import { useState, useEffect } from 'react'
import { FaSave, FaSpinner, FaPalette, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin } from 'react-icons/fa'

interface SettingsData {
  primaryColor: string
  siteName: string
  contactEmail: string
  contactPhone: string
  contactLocation: string
  githubUrl: string
  linkedinUrl: string
  emailUrl: string
}

const defaultSettings: SettingsData = {
  primaryColor: '#0ea5e9', // primary-600 par défaut
  siteName: 'Portfolio',
  contactEmail: 'contact@example.com',
  contactPhone: '+33 6 12 34 56 78',
  contactLocation: 'Paris, France',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  emailUrl: 'mailto:contact@example.com',
}

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings({
          primaryColor: data.primaryColor || defaultSettings.primaryColor,
          siteName: data.siteName || defaultSettings.siteName,
          contactEmail: data.contactEmail || defaultSettings.contactEmail,
          contactPhone: data.contactPhone || defaultSettings.contactPhone,
          contactLocation: data.contactLocation || defaultSettings.contactLocation,
          githubUrl: data.githubUrl || defaultSettings.githubUrl,
          linkedinUrl: data.linkedinUrl || defaultSettings.linkedinUrl,
          emailUrl: data.emailUrl || defaultSettings.emailUrl,
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value: String(value),
      }))

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsArray }),
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès !' })
        // Appliquer la couleur primaire immédiatement
        applyPrimaryColor(settings.primaryColor)
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

  const applyPrimaryColor = (color: string) => {
    // Appliquer la couleur primaire via CSS variables
    document.documentElement.style.setProperty('--primary-color', color)
    
    // Générer les nuances de couleur
    const rgb = hexToRgb(color)
    if (rgb) {
      // Générer des variantes plus claires et plus foncées
      const lighter = `rgb(${Math.min(255, rgb.r + 40)}, ${Math.min(255, rgb.g + 40)}, ${Math.min(255, rgb.b + 40)})`
      const darker = `rgb(${Math.max(0, rgb.r - 40)}, ${Math.max(0, rgb.g - 40)}, ${Math.max(0, rgb.b - 40)})`
      
      // Variantes pour les backgrounds légers
      const light10 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
      const light20 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`
      const light30 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`
      
      document.documentElement.style.setProperty('--primary-color-light', lighter)
      document.documentElement.style.setProperty('--primary-color-dark', darker)
      document.documentElement.style.setProperty('--primary-color-50', light10)
      document.documentElement.style.setProperty('--primary-color-100', light20)
      document.documentElement.style.setProperty('--primary-color-200', light30)
    }
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  useEffect(() => {
    if (settings.primaryColor) {
      applyPrimaryColor(settings.primaryColor)
    }
  }, [settings.primaryColor])

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
          Paramètres du site
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Couleur primaire */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaPalette className="text-primary-600" />
              Apparence
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur primaire
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="w-20 h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="#0ea5e9"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                />
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: settings.primaryColor }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Cette couleur sera utilisée pour les boutons, liens et éléments principaux du site.
              </p>
            </div>
          </div>

          {/* Informations générales */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaUser className="text-primary-600" />
              Informations générales
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du site
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Portfolio"
              />
            </div>
          </div>

          {/* Informations de contact */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaEnvelope className="text-primary-600" />
              Informations de contact
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaEnvelope />
                  Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaPhone />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt />
                  Localisation
                </label>
                <input
                  type="text"
                  value={settings.contactLocation}
                  onChange={(e) => setSettings({ ...settings, contactLocation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Liens sociaux */}
          <div className="pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaGithub className="text-primary-600" />
              Liens sociaux
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaGithub />
                  GitHub
                </label>
                <input
                  type="url"
                  value={settings.githubUrl}
                  onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaLinkedin />
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={settings.linkedinUrl}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaEnvelope />
                  Email (lien)
                </label>
                <input
                  type="text"
                  value={settings.emailUrl}
                  onChange={(e) => setSettings({ ...settings, emailUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="mailto:contact@example.com"
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
                Sauvegarder les paramètres
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

