import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Entry } from "@/lib/garden-data"

const statusStyles: Record<string, string> = {
  Active: "bg-primary text-primary-foreground",
  Shipped: "bg-accent text-accent-foreground",
  Sunset: "bg-secondary text-muted-foreground",
}

export function BentoCard({ entry }: { entry: Entry }) {
  const {
    title,
    description,
    meta,
    status,
    date,
    href,
    image,
    colSpan = 1,
    rowSpan = 1,
    accent,
    subsection,
  } = entry

  return (
    <a
      href={`/blog/${entry.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_30px_-18px_rgba(128,19,20,0.3)]",
        accent && "bg-accent/40",
        colSpan === 2 && "sm:col-span-2",
        rowSpan === 2 && "sm:row-span-2",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {subsection}
        </span>
        {status ? (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              statusStyles[status] ?? "bg-secondary text-muted-foreground",
            )}
          >
            {status}
          </span>
        ) : (
          <ArrowUpRight
            className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden
          />
        )}
      </div>

      <h3 className="mt-3 text-pretty font-sans text-xl leading-snug text-foreground sm:text-2xl">
        {title}
      </h3>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {image ? (
        <div className="relative mt-4 min-h-40 flex-1 overflow-hidden rounded-2xl border border-border">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 40vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className="flex-1" />
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        {meta ? <span>{meta}</span> : <span />}
        {date ? <span className="tabular-nums">{date}</span> : null}
      </div>
    </a>
  )
}
