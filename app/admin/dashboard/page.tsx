'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FaUser,
  FaCode,
  FaBriefcase,
  FaFolderOpen,
  FaChartBar,
} from 'react-icons/fa'

const adminSections = [
  {
    title: 'À propos',
    description: 'Gérer les informations personnelles',
    icon: FaUser,
    href: '/admin/about',
    color: 'bg-blue-500',
  },
  {
    title: 'Compétences',
    description: 'Gérer les compétences et technologies',
    icon: FaCode,
    href: '/admin/skills',
    color: 'bg-green-500',
  },
  {
    title: 'Expérience',
    description: 'Gérer l\'expérience professionnelle',
    icon: FaBriefcase,
    href: '/admin/experiences',
    color: 'bg-purple-500',
  },
  {
    title: 'Projets',
    description: 'Gérer les projets réalisés',
    icon: FaFolderOpen,
    href: '/admin/projects',
    color: 'bg-orange-500',
  },
  {
    title: 'Paramètres',
    description: 'Couleur primaire, contact, réseaux sociaux',
    icon: FaChartBar,
    href: '/admin/settings',
    color: 'bg-pink-500',
  },
]

export default function DashboardPage() {
  return (
    <div className="section-container">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600 mb-8">
          Gérez le contenu de votre portfolio
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminSections.map((section, index) => {
            const Icon = section.icon
            return (
              <Link
                key={index}
                href={section.href}
                className="card hover:scale-105 transition-transform duration-300"
              >
                <div className={`${section.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

