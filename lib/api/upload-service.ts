import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function saveUpload(file: File): Promise<{ uniqueName: string; filePath: string }> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })

  const ext = path.extname(file.name)
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const filePath = path.join(uploadDir, uniqueName)
  await writeFile(filePath, buffer)

  return { uniqueName, filePath }
}
