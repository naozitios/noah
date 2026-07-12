import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type PillarId = "products" | "investments" | "principles" | "assumptions"
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
  image?: string
  readingTime: number
}

const contentDir = path.join(process.cwd(), "content")

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

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

function parseEntryFile(file: string, pillar: string, subsection: string): Entry {
  const source = fs.readFileSync(file, "utf-8")
  const { data, content } = matter(source)
  const body = content.trim()
  const description = body.split("\n")[0] ?? body.slice(0, 200)
  const id = path.basename(file, ".md")
  return {
    id,
    pillar: (data.pillar ?? pillar) as PillarId,
    subsection: (data.subsection ?? subsection) as string,
    title: data.title as string,
    description,
    body,
    meta: data.meta as string | undefined,
    status: data.status as string | undefined,
    date: data.date as string | undefined,
    image: data.image as string | undefined,
    readingTime: calculateReadingTime(body),
  }
}

function readEntriesRecursively(dir: string, baseDir: string = dir): Entry[] {
  const entries: Entry[] = []
  const items = fs.readdirSync(dir)

  items.forEach((item) => {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      entries.push(...readEntriesRecursively(fullPath, baseDir))
    } else if (item.endsWith(".md")) {
      const relativePath = path.relative(baseDir, fullPath)
      const parts = relativePath.split(path.sep)
      const pillar = parts[0]
      const subsection = parts[1]
      entries.push(parseEntryFile(fullPath, pillar, subsection))
    }
  })

  return entries
}

export function getEntries(): Entry[] {
  const dir = path.join(contentDir, "entries")
  return readEntriesRecursively(dir)
}

export function getEntryById(id: string): Entry | undefined {
  const dir = path.join(contentDir, "entries")
  
  function findEntry(currentDir: string): Entry | undefined {
    const items = fs.readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        const found = findEntry(fullPath)
        if (found) return found
      } else if (item.replace(/\.md$/, "") === id) {
        const relativePath = path.relative(dir, fullPath)
        const parts = relativePath.split(path.sep)
        return parseEntryFile(fullPath, parts[0], parts[1])
      }
    }
    return undefined
  }
  
  return findEntry(dir)
}

export function getAllEntryIds(): string[] {
  const dir = path.join(contentDir, "entries")
  
  function collectIds(currentDir: string): string[] {
    const ids: string[] = []
    const items = fs.readdirSync(currentDir)
    
    items.forEach((item) => {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        ids.push(...collectIds(fullPath))
      } else if (item.endsWith(".md")) {
        ids.push(item.replace(/\.md$/, ""))
      }
    })
    
    return ids
  }
  
  return collectIds(dir)
}
