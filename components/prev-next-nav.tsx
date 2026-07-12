import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Entry } from "@/lib/garden-data"

export function PrevNextNav({ prev, next }: { prev: Entry | null; next: Entry | null }) {
  return (
    <nav className="mt-16 flex items-center justify-between border-t border-border pt-8">
      {prev ? (
        <Link
          href={`/${prev.pillar}/${prev.id}`}
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
          href={`/${next.pillar}/${next.id}`}
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
  )
}
