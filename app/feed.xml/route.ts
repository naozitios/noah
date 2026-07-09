import { getEntries } from "@/lib/garden-data";

export async function GET() {
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const siteName = process.env.SITE_NAME || "Noah's Knowledge Base";

  const entries = getEntries();

  const items = entries.map((e) => `
    <item>
      <title><![CDATA[${e.title}]]></title>
      <link>${siteUrl}/${e.pillar}/${e.id}</link>
      <description><![CDATA[${e.description || ''}]]></description>
      ${e.date ? `<pubDate>${new Date(e.date).toUTCString()}</pubDate>` : ''}
      <guid>${siteUrl}/${e.pillar}/${e.id}</guid>
    </item>
  `).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>Long-form articles on products, investments, engineering, and business principles.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
