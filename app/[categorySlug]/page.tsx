import { getPillars, getEntries } from "@/lib/garden-data";
import { notFound } from "next/navigation";
import { PillarPageClient } from "@/components/pillar-page-client";

export function generateStaticParams() {
  return getPillars().map((p) => ({ categorySlug: p.id }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const pillars = getPillars();
  const pillar = pillars.find((p) => p.id === categorySlug);

  if (!pillar) notFound();

  const entries = getEntries().filter((e) => e.pillar === categorySlug);

  return <PillarPageClient pillar={pillar} entries={entries} />;
}
