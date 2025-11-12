import { NextResponse } from 'next/server'
import { sequelize } from '@/models'
import models from '@/models'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Only allow in development or with proper authentication
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { message: 'This endpoint is not available in production' },
      { status: 403 }
    )
  }

  try {
    // Synchroniser les modèles avec la base de données (alter: true pour ajouter les colonnes/tables manquantes)
    await sequelize.sync({ alter: true })

    // Créer un utilisateur admin par défaut si aucun n'existe
    const adminExists = await models.User.findOne({
      where: { email: 'admin@example.com' },
    })

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await models.User.create({
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Administrateur',
        role: 'admin',
      })
      return NextResponse.json({
        message: 'Base de données initialisée. Email: admin@example.com, Password: admin123',
      })
    }

    return NextResponse.json({
      message: 'Base de données déjà initialisée',
    })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { message: 'Erreur lors de l\'initialisation', error: String(error) },
      { status: 500 }
    )
  }
}

