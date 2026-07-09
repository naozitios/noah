import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { media } from '@/db/schema';
import { AppError, handleError } from '@/lib/api/errors';
import { eq } from 'drizzle-orm';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [entry] = await db
      .select()
      .from(media)
      .where(eq(media.id, id))
      .limit(1);

    if (!entry) {
      throw new AppError('NOT_FOUND', 'Media not found', 404);
    }

    await db.delete(media).where(eq(media.id, id));

    try {
      const filePath = path.join(process.cwd(), 'public', entry.path);
      await unlink(filePath);
    } catch {
      // file may not exist on disk, that's ok
    }

    return NextResponse.json({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
