"use client"

import { useState, useEffect } from "react"
import { type Pillar, type Entry, type PillarId } from "@/lib/garden-data"
import { BentoCard } from "@/components/bento-card"

export function GardenBoard({
  pillars,
  entries,
  initialPillar,
}: {
  pillars: Pillar[]
  entries: Entry[]
  initialPillar?: PillarId
}) {
  const [subsectionFilter, setSubsectionFilter] = useState("")

  const activePillar = initialPillar ? pillars.find((p) => p.id === initialPillar) : null

  const pillarEntries = initialPillar
    ? entries.filter((e) => e.pillar === initialPillar)
    : entries

  const subsections = [...new Set(pillarEntries.map((e) => e.subsection).filter(Boolean))] as string[]

  useEffect(() => {
    setSubsectionFilter("")
  }, [initialPillar])

  const filteredEntries = subsectionFilter
    ? pillarEntries.filter((e) => e.subsection === subsectionFilter)
    : pillarEntries

  return (
    <div className="flex flex-col gap-10">
      {activePillar && (
        <section className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-2">{activePillar.label}</h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            {activePillar.blurb}
          </p>
        </section>
      )}

      {activePillar && subsections.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSubsectionFilter("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 ${
              !subsectionFilter
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {subsections.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubsectionFilter(subsectionFilter === sub ? "" : sub)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 ${
                subsectionFilter === sub
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {filteredEntries.length > 0 ? (
        <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEntries.map((entry) => (
            <BentoCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-muted-foreground">
          No entries yet.
        </p>
      )}
    </div>
  )
}
