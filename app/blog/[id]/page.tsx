import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Sprout } from "lucide-react"
import { getEntryById, getAllEntryIds, getEntries } from "@/lib/garden-data"
import { formatDate } from "@/lib/utils"
import { Inter } from "next/font/google"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const inter = Inter({ subsets: ["latin"] })

export function generateStaticParams() {
  return getAllEntryIds().map((id) => ({ id }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entry = getEntryById(id)

  if (!entry) notFound()

  const allEntries = getEntries()
  const currentIndex = allEntries.findIndex((e) => e.id === entry.id)
  const prev = currentIndex > 0 ? allEntries[currentIndex - 1] : null
  const next = currentIndex < allEntries.length - 1 ? allEntries[currentIndex + 1] : null

  return (
    <div className={`min-h-screen bg-background text-foreground ${inter.className}`}>
      <header className="flex items-center border-b border-border px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <Sprout className="h-5 w-5" aria-hidden />
          <span className="font-sans text-sm font-medium">Noah&apos;s digital garden</span>
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to garden
        </Link>

        <article>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium">{entry.subsection}</span>
            {entry.date && <span>{formatDate(entry.date)}</span>}
            <span>· {entry.readingTime} min read</span>
          </div>

          <h1 className="text-3xl font-sans font-bold leading-tight sm:text-4xl">{entry.title}</h1>

          <div className="mt-8 text-base leading-relaxed text-muted-foreground space-y-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => <h2 className="mt-8 mb-3 text-xl font-semibold text-foreground">{children}</h2>,
                h3: ({ children }) => <h3 className="mt-6 mb-2 text-lg font-semibold text-foreground">{children}</h3>,
                p: ({ children }) => <p className="leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
                a: ({ href, children }) => <a href={href} className="text-primary underline underline-offset-2 hover:no-underline">{children}</a>,
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                code: ({ children }) => <code className="rounded bg-secondary px-1.5 py-0.5 text-sm font-mono">{children}</code>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-primary/30 pl-4 italic">{children}</blockquote>,
              }}
            >
              {entry.body}
            </ReactMarkdown>
          </div>
        </article>

        <nav className="mt-16 flex items-center justify-between border-t border-border pt-8">
          {prev ? (
            <Link
              href={`/blog/${prev.id}`}
              className="group flex flex-col items-start gap-1 text-sm"
            >
              <span className="text-xs text-muted-foreground">Previous</span>
              <span className="flex items-center gap-1 font-medium text-foreground transition-colors group-hover:text-primary">
                <ArrowLeft className="h-3.5 w-3.5" /> {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/blog/${next.id}`}
              className="group flex flex-col items-end gap-1 text-sm text-right"
            >
              <span className="text-xs text-muted-foreground">Next</span>
              <span className="flex items-center gap-1 font-medium text-foreground transition-colors group-hover:text-primary">
                {next.title} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </main>
    </div>
  )
}
