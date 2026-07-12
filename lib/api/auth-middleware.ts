import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { AppError } from '@/lib/api/errors'

export async function requireAuth(request: NextRequest): Promise<{ username: string }> {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('UNAUTHORIZED', 'Missing or invalid authorization header', 401)
  }

  const token = authHeader.split(' ')[1]
  const user = await verifyToken(token)

  if (!user) {
    throw new AppError('UNAUTHORIZED', 'Invalid or expired token', 401)
  }

  return user
}
