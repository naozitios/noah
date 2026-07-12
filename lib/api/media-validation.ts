import { z } from 'zod'

export const mediaItemSchema = z.object({
  id: z.string(),
  filename: z.string(),
  path: z.string(),
  mimeType: z.string().nullable(),
  sizeBytes: z.number().nullable(),
  createdAt: z.date().or(z.string()),
})

export type MediaItem = z.infer<typeof mediaItemSchema>

export const uploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
})
