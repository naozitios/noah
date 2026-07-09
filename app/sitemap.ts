import { getEntries, getPillars } from "@/lib/garden-data";

export default async function sitemap() {
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const entries = getEntries();
  const pillars = getPillars();

  const sitemapEntries = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    ...pillars.map((p) => ({
      url: `${siteUrl}/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...entries.map((e) => ({
      url: `${siteUrl}/${e.pillar}/${e.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return sitemapEntries;
}
