import { getEntryById, getEntries } from "@/lib/garden-data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Markdown } from "@/components/markdown"
import { ArticleMeta } from "@/components/article-meta"
import { Breadcrumb } from "@/components/breadcrumb"
import { PrevNextNav } from "@/components/prev-next-nav"

export function generateStaticParams() {
  return getEntries().map((e) => ({
    categorySlug: e.pillar,
    articleSlug: e.id,
  }))
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ categorySlug: string; articleSlug: string }>
}) {
  const { categorySlug, articleSlug } = await params
  const entry = getEntryById(articleSlug)

  if (!entry || entry.pillar !== categorySlug) notFound()

  const allEntries = getEntries()
  const currentIndex = allEntries.findIndex((e) => e.id === entry.id)
  const prev = currentIndex > 0 ? allEntries[currentIndex - 1] : null
  const next = currentIndex < allEntries.length - 1 ? allEntries[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Home
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: categorySlug, href: `/${categorySlug}` },
        ]} />

        <article>
          <ArticleMeta entry={entry} />

          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{entry.title}</h1>

          <div className="mt-8 text-base leading-relaxed space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown content={entry.body} />
            </div>
          </div>
        </article>

        <PrevNextNav prev={prev} next={next} />
      </main>
    </div>
  )
}
