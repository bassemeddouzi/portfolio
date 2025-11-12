'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FaHome, FaSignOutAlt, FaCog } from 'react-icons/fa'

export default function AdminNavbar() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/admin/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <FaHome />
              <span className="hidden sm:inline">Voir le site</span>
            </a>
            <a
              href="/admin/dashboard"
              className="text-xl font-bold text-primary-600"
            >
              Dashboard Admin
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

