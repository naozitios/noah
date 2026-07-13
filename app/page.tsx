import { getPillars, getEntries } from "@/lib/garden-data";
import { PageShell } from "@/components/page-shell";

export default async function HomePage() {
  const pillars = getPillars();
  const entries = getEntries();

  return <PageShell pillars={pillars} entries={entries} />;
}
