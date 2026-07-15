"use client";

import { useState } from "react";
import { type Pillar, type Entry } from "@/lib/garden-data";
import { BentoCard } from "@/components/bento-card";

export function GardenBoard({
  entries,
  pillar,
}: {
  entries: Entry[];
  pillar?: Pillar;
}) {
  const [subsectionFilter, setSubsectionFilter] = useState("");

  const subsections = [
    ...new Set(entries.map((e) => e.subsection).filter(Boolean)),
  ] as string[];

  const filteredEntries = subsectionFilter
    ? entries.filter((e) => e.subsection === subsectionFilter)
    : entries;

  return (
    <div className="flex flex-col gap-10">
      {pillar && (
        <section className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-2">{pillar.label}</h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            {pillar.blurb}
          </p>
        </section>
      )}

      {subsections.length > 1 && (
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
              onClick={() =>
                setSubsectionFilter(subsectionFilter === sub ? "" : sub)
              }
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
  );
}
