import { NextRequest, NextResponse } from 'next/server'
import { handleError } from '@/lib/api/errors'
import { requireAuth } from '@/lib/api/auth-middleware'
import { createMediaRecord } from '@/lib/api/media-service'
import { saveUpload } from '@/lib/api/upload-service'

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request)
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: { code: 'NO_FILE', message: 'No file provided' } },
        { status: 400 },
      )
    }

    const { buffer } = await saveUpload(file)
    const entry = await createMediaRecord({
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      fileData: buffer,
    })

    return NextResponse.json({ media: entry }, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
