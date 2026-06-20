import { WorldTreeAuditExport } from "@/features/journey/components/world-tree-audit-export";
import { buildWorldTreeAuditJourney } from "@/features/journey/data/world-tree-audit-journey";

export const metadata = {
  title: "World Tree Audit · Noboru",
  description: "Full-tree art audit export — mock blueprint data, no auth.",
};

export default function TreeAuditPage() {
  const journey = buildWorldTreeAuditJourney();

  return <WorldTreeAuditExport journey={journey} />;
}
