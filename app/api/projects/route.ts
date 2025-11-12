import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import models from '@/models'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const projects = await models.Project.findAll({
      order: [['order', 'ASC'], ['createdAt', 'DESC']],
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
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
    const project = await models.Project.create(body)

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
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

    const project = await models.Project.findByPk(id)
    if (!project) {
      return NextResponse.json(
        { message: 'Non trouvé' },
        { status: 404 }
      )
    }

    await project.update(updateData)
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID requis' },
        { status: 400 }
      )
    }

    const project = await models.Project.findByPk(id)
    if (!project) {
      return NextResponse.json(
        { message: 'Non trouvé' },
        { status: 404 }
      )
    }

    await project.destroy()
    return NextResponse.json({ message: 'Supprimé avec succès' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

