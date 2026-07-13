import { getPillars, getEntries } from "@/lib/garden-data";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return getPillars().map((p) => ({ categorySlug: p.id }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const pillars = getPillars();
  const pillar = pillars.find((p) => p.id === categorySlug);

  if (!pillar) notFound();

  const entries = getEntries().filter((e) => e.pillar === categorySlug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Home
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>{pillar.label}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-3">{pillar.label}</h1>
        {pillar.blurb && (
          <p className="text-muted-foreground mb-8">{pillar.blurb}</p>
        )}

        {entries.length === 0 ? (
          <p className="text-muted-foreground">No entries yet.</p>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <article key={entry.id}>
                <Link
                  href={`/${categorySlug}/${entry.id}`}
                  className="group block"
                >
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {entry.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {entry.description}
                  </p>
                  {entry.date && (
                    <time className="mt-1 text-xs text-muted-foreground block">
                      {formatDate(String(entry.date))}
                    </time>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
