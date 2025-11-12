'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { FaSun, FaMoon } from 'react-icons/fa'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <FaMoon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <FaSun className="h-5 w-5 text-yellow-500" />
      )}
    </button>
  )
}

