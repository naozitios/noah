import { getEntryById, formatDate } from "@/lib/garden-data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Markdown } from "@/components/markdown"

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ categorySlug: string; articleSlug: string }>
}) {
  const { categorySlug, articleSlug } = await params
  const entry = getEntryById(articleSlug)

  if (!entry || entry.pillar !== categorySlug) notFound()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Home
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${categorySlug}`} className="hover:text-foreground">
            {categorySlug}
          </Link>
        </nav>

        <article>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            {entry.subsection && (
              <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium">{entry.subsection}</span>
            )}
            {entry.date && <span>{formatDate(entry.date)}</span>}
            <span>· {entry.readingTime} min read</span>
          </div>

          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{entry.title}</h1>

          <div className="mt-8 text-base leading-relaxed space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown content={entry.body} />
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}
