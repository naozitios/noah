"use client";

import { type Pillar, type Entry } from "@/lib/garden-data";
import { SiteHeader } from "@/components/site-header";
import { GardenBoard } from "@/components/garden-board";
import { SiteFooter } from "@/components/site-footer";

export function PillarPageClient({
  pillar,
  entries,
}: {
  pillar: Pillar;
  entries: Entry[];
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1 px-6 pt-3 pb-10 sm:px-10 sm:pt-4 sm:pb-14 lg:px-12 lg:pt-5 lg:pb-16">
        <GardenBoard pillar={pillar} entries={entries} />
        <SiteFooter />
      </main>
    </div>
  );
}
