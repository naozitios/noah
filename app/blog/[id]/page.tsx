import { redirect } from 'next/navigation'
import { getEntryById, getAllEntryIds } from '@/lib/garden-data'

export function generateStaticParams() {
  return getAllEntryIds().map((id) => ({ id }))
}

export default async function BlogRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entry = getEntryById(id)

  if (!entry) return null

  redirect(`/${entry.pillar}/${entry.id}`)
}
