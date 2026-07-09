import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type PillarId = "research" | "frameworks" | "building"
export type PageId = "home" | PillarId

export type Pillar = {
  id: PillarId
  label: string
  blurb: string
  subsections: string[]
}

export type Entry = {
  id: string
  pillar: PillarId
  subsection: string
  title: string
  description: string
  body: string
  meta?: string
  status?: string
  date?: string
  href?: string
  image?: string
  colSpan?: 1 | 2
  rowSpan?: 1 | 2
  accent?: boolean
}

const contentDir = path.join(process.cwd(), "content")

export function getPillars(): Pillar[] {
  const dir = path.join(contentDir, "pillars")
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"))

  return files.map((file) => {
    const source = fs.readFileSync(path.join(dir, file), "utf-8")
    const { data } = matter(source)
    return {
      id: data.id as PillarId,
      label: data.label as string,
      blurb: data.blurb as string,
      subsections: (data.subsections ?? []) as string[],
    }
  })
}

function parseEntryFile(file: string): Entry {
  const source = fs.readFileSync(path.join(contentDir, "entries", file), "utf-8")
  const { data, content } = matter(source)
  const body = content.trim()
  const description = body.split("\n")[0] ?? body.slice(0, 200)
  return {
    id: data.id as string,
    pillar: data.pillar as PillarId,
    subsection: data.subsection as string,
    title: data.title as string,
    description,
    body,
    meta: data.meta as string | undefined,
    status: data.status as string | undefined,
    date: data.date as string | undefined,
    href: data.href as string | undefined,
    image: data.image as string | undefined,
    colSpan: data.colSpan as 1 | 2 | undefined,
    rowSpan: data.rowSpan as 1 | 2 | undefined,
    accent: data.accent as boolean | undefined,
  }
}

export function getEntries(): Entry[] {
  const dir = path.join(contentDir, "entries")
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"))
  return files.map(parseEntryFile)
}

export function getEntryById(id: string): Entry | undefined {
  const dir = path.join(contentDir, "entries")
  const file = fs.readdirSync(dir).find((f) => f.replace(/\.md$/, "") === id)
  if (!file) return undefined
  return parseEntryFile(file)
}

export function getAllEntryIds(): string[] {
  const dir = path.join(contentDir, "entries")
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""))
}
