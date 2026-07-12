import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { media } from '@/db/schema';
import { handleError } from '@/lib/api/errors';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: { code: 'NO_FILE', message: 'No file provided' } },
        { status: 400 },
      );
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const [entry] = await db
      .insert(media)
      .values({
        filename: file.name,
        path: `/uploads/${uniqueName}`,
        mimeType: file.type,
        sizeBytes: file.size,
      })
      .returning();

    return NextResponse.json({ media: entry }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
