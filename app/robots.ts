const siteUrl = process.env.SITE_URL || "http://localhost:3000";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
