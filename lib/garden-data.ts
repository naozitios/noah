import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PillarId =
  "products" | "investments" | "principles" | "assumptions";
export type PageId = "home" | PillarId;

export type Pillar = {
  id: PillarId;
  label: string;
  blurb: string;
  subsections: Record<string, string>;
};

export type Entry = {
  id: string;
  pillar: PillarId;
  subsection: string;
  title: string;
  description: string;
  body: string;
  meta?: string;
  status?: string;
  date?: string;
  image?: string;
  readingTime: number;
  ready: boolean;
  pin: boolean;
};

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

const contentDir = path.join(process.cwd(), "content");

let _pillarsCache: Pillar[] | null = null;
let _entriesCache: Entry[] | null = null;

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function getPillars(): Pillar[] {
  if (_pillarsCache) return _pillarsCache;
  const dir = path.join(contentDir, "pillars");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  _pillarsCache = files.map((file) => {
    const source = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data } = matter(source);
    const subsections = (data.subsections ?? {}) as Record<string, string>;
    return {
      id: data.id as PillarId,
      label: data.label as string,
      blurb: data.blurb as string,
      subsections,
    };
  });

  return _pillarsCache;
}

function parseEntryFile(
  file: string,
  pillarDir: string,
  subsectionDir: string,
): Entry {
  const source = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(source);
  const body = content.trim();
  const firstLine = body.split("\n")[0] ?? body.slice(0, 200);
  const fallback = firstLine.replace(/^#+\s*/, "");
  const description = (data.description as string) || fallback;
  const id = path.basename(file, ".md");

  const pillar = pillarDir as PillarId;
  const pillarData = getPillars().find((p) => p.id === pillar);
  const subsection = pillarData?.subsections?.[subsectionDir] ?? subsectionDir;

  return {
    id,
    pillar,
    subsection,
    title: data.title as string,
    description,
    body,
    meta: data.meta as string | undefined,
    status: data.status as string | undefined,
    date: data.date as string | undefined,
    image: data.image as string | undefined,
    readingTime: calculateReadingTime(body),
    ready: data.ready === true,
    pin: data.pin === true,
  };
}

function readEntriesRecursively(dir: string, baseDir: string = dir): Entry[] {
  const entries: Entry[] = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      entries.push(...readEntriesRecursively(fullPath, baseDir));
    } else if (item.endsWith(".md")) {
      const relativePath = path.relative(baseDir, fullPath);
      const parts = relativePath.split(path.sep);
      const pillar = parts[0];
      const subsection = parts[1];
      entries.push(parseEntryFile(fullPath, pillar, subsection));
    }
  });

  return entries;
}

function loadAllEntries(): Entry[] {
  if (_entriesCache) return _entriesCache;
  const dir = path.join(contentDir, "entries");
  _entriesCache = readEntriesRecursively(dir);
  return _entriesCache;
}

export function getEntries(): Entry[] {
  const all = loadAllEntries();
  return isProduction() ? all.filter((e) => e.ready) : all;
}

export function getEntryById(id: string): Entry | undefined {
  const entry = getEntries().find((e) => e.id === id);
  if (!entry) return undefined;
  if (isProduction() && !entry.ready) return undefined;
  return entry;
}

export function getAllEntryIds(): string[] {
  return getEntries().map((e) => e.id);
}
