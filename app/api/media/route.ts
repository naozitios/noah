import { NextResponse } from 'next/server';
import { db } from '@/db';
import { media } from '@/db/schema';
import { handleError } from '@/lib/api/errors';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db
      .select()
      .from(media)
      .orderBy(desc(media.createdAt));

    return NextResponse.json({ media: result });
  } catch (err) {
    return handleError(err);
  }
}
