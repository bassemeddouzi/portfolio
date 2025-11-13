import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import models from '@/models'

export const dynamic = 'force-dynamic'

type AboutInstance = InstanceType<typeof models.About>

const serializeAbout = (about: AboutInstance | null) => {
  if (!about) return null
  const json = about.toJSON() as any

  if (json.imageData) {
    let buffer: Buffer | null = null
    if (Buffer.isBuffer(json.imageData)) {
      buffer = json.imageData
    } else if (
      typeof json.imageData === 'object' &&
      json.imageData !== null &&
      Array.isArray(json.imageData.data)
    ) {
      buffer = Buffer.from(json.imageData.data)
    } else if (Array.isArray(json.imageData)) {
      buffer = Buffer.from(json.imageData)
    }

    if (buffer) {
      const mime = json.imageMimeType || 'image/jpeg'
      json.imageSrc = `data:${mime};base64,${buffer.toString('base64')}`
    }
  } else if (json.imageUrl) {
    json.imageSrc = json.imageUrl
  } else {
    json.imageSrc = null
  }

  delete json.imageData

  return json
}

const parseAboutPayload = async (request: NextRequest) => {
  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData()
    const statsRaw = formData.get('stats')
    let stats: any = undefined

    if (typeof statsRaw === 'string' && statsRaw.trim() !== '') {
      try {
        stats = JSON.parse(statsRaw)
      } catch {
        stats = undefined
      }
    }

    const imageFile = formData.get('image')
    const removeImage = formData.get('removeImage') === 'true'

    const payload: Record<string, any> = {
      id: formData.get('id') ? Number(formData.get('id')) : undefined,
      name: formData.get('name')?.toString() || '',
      jobTitle: formData.get('jobTitle')?.toString() || '',
      title: formData.get('title')?.toString() || '',
      description: formData.get('description')?.toString() || '',
      stats: stats ?? {},
    }

    if (imageFile instanceof File && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer()
      payload.imageData = Buffer.from(arrayBuffer)
      payload.imageMimeType = imageFile.type || 'application/octet-stream'
      payload.imageUrl = null
    } else if (removeImage) {
      payload.imageData = null
      payload.imageMimeType = null
      payload.imageUrl = null
    }

    return payload
  }

  const jsonPayload = await request.json()
  if (jsonPayload && typeof jsonPayload === 'object') {
    jsonPayload.stats = jsonPayload.stats ?? {}
  }
  return jsonPayload
}

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

    return NextResponse.json(serializeAbout(about))
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

    const payload = await parseAboutPayload(request)
    const about = await models.About.create(payload)

    return NextResponse.json(serializeAbout(about), { status: 201 })
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

    const payload = await parseAboutPayload(request)
    const { id, ...updateData } = payload

    const about = await models.About.findByPk(id)
    if (!about) {
      return NextResponse.json(
        { message: 'Non trouvé' },
        { status: 404 }
      )
    }

    await about.update(updateData)
    return NextResponse.json(serializeAbout(about))
  } catch (error) {
    console.error('Error updating about:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

