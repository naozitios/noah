import { formatDate } from "@/lib/utils"
import type { Entry } from "@/lib/garden-data"

export function ArticleMeta({ entry }: { entry: Entry }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
      {entry.subsection && (
        <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium">{entry.subsection}</span>
      )}
      {entry.date && <span>{formatDate(entry.date)}</span>}
      <span>· {entry.readingTime} min read</span>
    </div>
  )
}
