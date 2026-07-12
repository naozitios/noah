"use client"

import { useState } from "react"
import { type Pillar, type Entry, type PageId } from "@/lib/garden-data"
import { SiteHeader } from "@/components/site-header"
import { IntroCard } from "@/components/intro-card"
import { GardenBoard } from "@/components/garden-board"
import { SiteFooter } from "@/components/site-footer"

export function PageShell({
  pillars,
  entries,
}: {
  pillars: Pillar[]
  entries: Entry[]
}) {
  const [activePage, setActivePage] = useState<PageId>("home")

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader activePage={activePage} onNavigate={setActivePage} />

      <main className="flex-1 px-6 pt-3 pb-10 sm:px-10 sm:pt-4 sm:pb-14 lg:px-12 lg:pt-5 lg:pb-16">
        {activePage === "home" ? (
          <>
            <IntroCard onNavigate={setActivePage} />
            <div className="mt-12 sm:mt-16">
              <GardenBoard pillars={pillars} entries={entries} />
            </div>
          </>
        ) : (
          <GardenBoard
            key={activePage}
            pillars={pillars}
            entries={entries}
            initialPillar={activePage}
          />
        )}

        <SiteFooter />
      </main>
    </div>
  )
}
