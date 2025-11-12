import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import models from '@/models'

export async function GET() {
  try {
    const about = await models.About.findOne({
      order: [['createdAt', 'DESC']],
    })

    if (!about) {
      return NextResponse.json(
        { message: 'Aucune information trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error('Error fetching about:', error)
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
    const about = await models.About.create(body)

    return NextResponse.json(about, { status: 201 })
  } catch (error) {
    console.error('Error creating about:', error)
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
    const { id, ...updateData } = body

    const about = await models.About.findByPk(id)
    if (!about) {
      return NextResponse.json(
        { message: 'Non trouvé' },
        { status: 404 }
      )
    }

    await about.update(updateData)
    return NextResponse.json(about)
  } catch (error) {
    console.error('Error updating about:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

