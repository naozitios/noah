export async function saveUpload(file: File): Promise<{ buffer: Buffer }> {
  const buffer = Buffer.from(await file.arrayBuffer())
  return { buffer }
}
