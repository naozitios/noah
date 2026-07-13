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
  const rows = await db
    .select({
      id: media.id,
      filename: media.filename,
      path: media.path,
      mimeType: media.mimeType,
      sizeBytes: media.sizeBytes,
      altText: media.altText,
      createdAt: media.createdAt,
    })
    .from(media)
    .orderBy(desc(media.createdAt));
  return rows as MediaRecord[];
}

export async function createMediaRecord(data: {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  fileData: Buffer;
}): Promise<MediaRecord> {
  const db = getDb();
  const [entry] = await db
    .insert(media)
    .values({
      filename: data.filename,
      path: "",
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      data: data.fileData,
    })
    .returning({
      id: media.id,
      filename: media.filename,
      path: media.path,
      mimeType: media.mimeType,
      sizeBytes: media.sizeBytes,
      altText: media.altText,
      createdAt: media.createdAt,
    });

  const path = `/api/media/${entry.id}/file`;
  await db.update(media).set({ path }).where(eq(media.id, entry.id));

  return { ...(entry as MediaRecord), path };
}

export async function getMediaRecord(id: string): Promise<MediaRecord | null> {
  const db = getDb();
  const [entry] = await db
    .select({
      id: media.id,
      filename: media.filename,
      path: media.path,
      mimeType: media.mimeType,
      sizeBytes: media.sizeBytes,
      altText: media.altText,
      createdAt: media.createdAt,
    })
    .from(media)
    .where(eq(media.id, id))
    .limit(1);

  return (entry as MediaRecord) ?? null;
}

export async function getMediaData(id: string): Promise<{
  data: Buffer;
  mimeType: string | null;
  filename: string;
} | null> {
  const db = getDb();
  const [entry] = await db
    .select({
      data: media.data,
      mimeType: media.mimeType,
      filename: media.filename,
    })
    .from(media)
    .where(eq(media.id, id))
    .limit(1);

  if (!entry) return null;
  return entry as { data: Buffer; mimeType: string | null; filename: string };
}

export async function deleteMediaRecord(id: string): Promise<void> {
  const db = getDb();
  await db.delete(media).where(eq(media.id, id));
}
