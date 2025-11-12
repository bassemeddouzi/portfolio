'use client'

import { useEffect } from 'react'

export function usePrimaryColor() {
  useEffect(() => {
    // Charger la couleur primaire depuis les paramètres
    fetch('/api/settings')
      .then((res) => res.json())
      .then((settings) => {
        if (settings.primaryColor) {
          applyPrimaryColor(settings.primaryColor)
        }
      })
      .catch(() => {})
  }, [])

  const applyPrimaryColor = (color: string) => {
    document.documentElement.style.setProperty('--primary-color', color)
    
    const rgb = hexToRgb(color)
    if (rgb) {
      // Générer des variantes plus claires et plus foncées
      const lighter = `rgb(${Math.min(255, rgb.r + 40)}, ${Math.min(255, rgb.g + 40)}, ${Math.min(255, rgb.b + 40)})`
      const darker = `rgb(${Math.max(0, rgb.r - 40)}, ${Math.max(0, rgb.g - 40)}, ${Math.max(0, rgb.b - 40)})`
      
      // Variantes pour les backgrounds légers (10%, 20%, 30%)
      const light10 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
      const light20 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`
      const light30 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`
      
      document.documentElement.style.setProperty('--primary-color-light', lighter)
      document.documentElement.style.setProperty('--primary-color-dark', darker)
      document.documentElement.style.setProperty('--primary-color-50', light10)
      document.documentElement.style.setProperty('--primary-color-100', light20)
      document.documentElement.style.setProperty('--primary-color-200', light30)
      
      // Mettre à jour les gradients
      document.documentElement.style.setProperty('--gradient-hero', `linear-gradient(to bottom right, ${light10}, white, ${light10})`)
      document.documentElement.style.setProperty('--gradient-project', `linear-gradient(to bottom right, ${lighter}, ${color})`)
      document.documentElement.style.setProperty('--gradient-about', `linear-gradient(to bottom right, ${lighter}, ${color})`)
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
}

