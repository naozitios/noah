import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

function makeToken(password: string): string {
  const expiry = Date.now() + 86400000; // 24 hours
  const hash = createHash('sha256').update(password + ':' + expiry).digest('hex');
  return hash + ':' + expiry;
}

export function verifyToken(token: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const parts = token.split(':');
  if (parts.length !== 2) return false;

  const [hash, expiryStr] = parts;
  const expiry = parseInt(expiryStr);

  if (Date.now() > expiry) return false;

  const expected = createHash('sha256').update(adminPassword + ':' + expiry).digest('hex');
  return hash === expected;
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Invalid password' } },
      { status: 401 },
    );
  }

  const token = makeToken(adminPassword);
  return NextResponse.json({ token });
}
