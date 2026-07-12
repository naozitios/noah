import type { Entry, Pillar, PillarId } from "@/lib/garden-data"

export interface ContentService {
  getEntries(): Entry[]
  getEntryById(id: string): Entry | undefined
  getAllEntryIds(): string[]
  getPillars(): Pillar[]
}
