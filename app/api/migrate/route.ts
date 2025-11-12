import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sequelize } from '@/models'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Synchroniser les modèles avec alter: true pour ajouter les colonnes manquantes
    await sequelize.sync({ alter: true })

    return NextResponse.json({
      message: 'Base de données mise à jour avec succès. Les nouvelles colonnes ont été ajoutées.',
    })
  } catch (error) {
    console.error('Error migrating database:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la migration', error: String(error) },
      { status: 500 }
    )
  }
}

