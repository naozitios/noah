import { getEntries } from "@/lib/garden-data";
import { PageShell } from "@/components/page-shell";

export default async function HomePage() {
  const entries = getEntries();
  return <PageShell entries={entries} />;
}
