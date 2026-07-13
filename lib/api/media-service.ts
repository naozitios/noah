import { getDb } from "@/db";
import { media } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

type MediaRecord = {
  id: string;
  filename: string;
  path: string;
  mimeType: string | null;
  sizeBytes: number | null;
  altText: string | null;
  createdAt: Date;
};

export async function listMedia(): Promise<MediaRecord[]> {
  const db = getDb();
  return db.select().from(media).orderBy(desc(media.createdAt));
}

export async function createMediaRecord(data: {
  filename: string;
  path: string;
  mimeType: string;
  sizeBytes: number;
}): Promise<MediaRecord> {
  const db = getDb();
  const [entry] = await db
    .insert(media)
    .values({
      filename: data.filename,
      path: data.path,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
    })
    .returning();

  return entry;
}

export async function getMediaRecord(id: string): Promise<MediaRecord | null> {
  const db = getDb();
  const [entry] = await db
    .select()
    .from(media)
    .where(eq(media.id, id))
    .limit(1);

  return entry ?? null;
}

export async function deleteMediaRecord(id: string): Promise<void> {
  const db = getDb();
  await db.delete(media).where(eq(media.id, id));
}
