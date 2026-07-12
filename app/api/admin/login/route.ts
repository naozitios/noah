import { NextRequest, NextResponse } from 'next/server'
import { createToken, verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (!password) {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'Password is required' } },
      { status: 400 },
    )
  }

  const passwordHash = process.env.ADMIN_PASSWORD_HASH
  if (!passwordHash) {
    return NextResponse.json(
      { error: { code: 'CONFIG_ERROR', message: 'Admin password hash not configured' } },
      { status: 500 },
    )
  }

  const valid = await verifyPassword(password, passwordHash)
  if (!valid) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Invalid password' } },
      { status: 401 },
    )
  }

  const token = await createToken({ username: 'admin' })
  return NextResponse.json({ token })
}
