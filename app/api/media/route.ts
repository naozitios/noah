import { NextRequest, NextResponse } from 'next/server'
import { handleError } from '@/lib/api/errors'
import { requireAuth } from '@/lib/api/auth-middleware'
import { listMedia } from '@/lib/api/media-service'

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request)
    const result = await listMedia()
    return NextResponse.json({ media: result })
  } catch (err) {
    return handleError(err)
  }
}
