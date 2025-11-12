import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import models from '@/models'

export async function GET() {
  try {
    const settings = await models.Settings.findAll()
    
    // Convertir en objet clé-valeur
    const settingsObj: Record<string, string> = {}
    settings.forEach((setting) => {
      settingsObj[setting.key] = setting.value
    })

    return NextResponse.json(settingsObj)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { key, value, description } = body

    if (!key || value === undefined) {
      return NextResponse.json(
        { message: 'Clé et valeur requises' },
        { status: 400 }
      )
    }

    // Créer ou mettre à jour le paramètre
    const [setting, created] = await models.Settings.upsert({
      key,
      value: String(value),
      description: description || null,
    }, {
      returning: true,
    })

    return NextResponse.json(setting, { status: created ? 201 : 200 })
  } catch (error) {
    console.error('Error saving setting:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { settings } = body // Tableau de { key, value, description }

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { message: 'Format invalide' },
        { status: 400 }
      )
    }

    // Mettre à jour tous les paramètres
    const updates = await Promise.all(
      settings.map(({ key, value, description }: { key: string; value: string; description?: string }) =>
        models.Settings.upsert({
          key,
          value: String(value),
          description: description || null,
        }, {
          returning: true,
        })
      )
    )

    return NextResponse.json({ 
      message: 'Paramètres mis à jour avec succès',
      updated: updates.length 
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

