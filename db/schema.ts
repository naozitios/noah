import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const media = pgTable('media', {
  id: uuid('id').defaultRandom().primaryKey(),
  filename: varchar('filename', { length: 500 }).notNull(),
  path: varchar('path', { length: 500 }).notNull(),
  mimeType: varchar('mime_type', { length: 50 }),
  sizeBytes: integer('size_bytes'),
  altText: text('alt_text'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
