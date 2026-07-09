"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { type Pillar, type Entry, type PillarId } from "@/lib/garden-data"
import { BentoCard } from "@/components/bento-card"

type Filter = "all" | PillarId

function useSliderIndicator(activeValue: string) {
  const ref = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const activeEl = container.querySelector(`[data-value="${activeValue}"]`) as HTMLElement | null
    if (activeEl) {
      const { offsetLeft, offsetWidth } = activeEl
      setIndicator({ left: offsetLeft, width: offsetWidth })
    }
  }, [activeValue])

  return { ref, indicator }
}

export function GardenBoard({
  pillars,
  entries,
  initialPillar,
}: {
  pillars: Pillar[]
  entries: Entry[]
  initialPillar?: PillarId
}) {
  const [filter, setFilter] = useState<Filter>(initialPillar ?? "all")
  const [subsection, setSubsection] = useState<string>("all")

  const activePillar = filter !== "all" ? pillars.find((p) => p.id === filter) : null

  const filteredEntries = entries.filter((e) => {
    if (filter !== "all" && e.pillar !== filter) return false
    if (subsection !== "all" && e.subsection !== subsection) return false
    return true
  })

  const { ref: pillarRef, indicator: pillarIndicator } = useSliderIndicator(filter)
  const { ref: subRef, indicator: subIndicator } = useSliderIndicator(subsection)

  const handlePillarClick = (pillar: Filter) => {
    if (pillar === filter) {
      setFilter("all")
      setSubsection("all")
    } else {
      setFilter(pillar)
      setSubsection("all")
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Pillar filter bar */}
      <div className="border-b border-border pb-4">
        <div ref={pillarRef} className="relative inline-flex rounded-lg bg-secondary p-0.5">
          <div
            className="absolute top-0.5 bottom-0.5 rounded-md bg-background shadow-sm transition-all duration-300 ease-in-out"
            style={{ left: pillarIndicator.left, width: pillarIndicator.width }}
          />
          <button
            data-value="all"
            onClick={() => { setFilter("all"); setSubsection("all") }}
            className={cn(
              "relative z-10 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              filter === "all" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {pillars.map((p) => (
            <button
              key={p.id}
              data-value={p.id}
              onClick={() => handlePillarClick(p.id)}
              className={cn(
                "relative z-10 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                filter === p.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subsection filter bar */}
      {activePillar && (
        <div className="-mt-4">
          <div ref={subRef} className="relative inline-flex rounded-lg bg-secondary/60 p-0.5">
            <div
              className="absolute top-0.5 bottom-0.5 rounded-md bg-background shadow-xs transition-all duration-300 ease-in-out"
              style={{ left: subIndicator.left, width: subIndicator.width }}
            />
            <button
              data-value="all"
              onClick={() => setSubsection("all")}
              className={cn(
                "relative z-10 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                subsection === "all" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              All {activePillar.label}
            </button>
            {activePillar.subsections.map((s) => (
              <button
                key={s}
                data-value={s}
                onClick={() => setSubsection(s)}
                className={cn(
                  "relative z-10 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  subsection === s ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {filteredEntries.length > 0 ? (
        <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEntries.map((entry) => (
            <BentoCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-muted-foreground">
          No entries yet. Create a markdown file in <code>content/entries/</code> to add one.
        </p>
      )}
    </div>
  )
}
