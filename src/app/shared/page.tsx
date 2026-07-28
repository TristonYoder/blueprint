import DomainSheet from "@/components/DomainSheet";
import { goals, redlines } from "@/lib/mock-data";

// No "shared" goals defined in mock data yet — deliberately demonstrates the
// "no plan on file" state (distinct from all-clear) called out in
// design-brief.md.
export default function SharedPage() {
  const domainGoals = goals.filter((g) => g.domain === "shared");
  const domainRedlines = redlines.filter((r) => r.domain === "shared");

  return (
    <DomainSheet
      sheetName="SHARED"
      revision="REV A"
      dateLabel="2026-07-27"
      domainLabel="Shared"
      redlines={domainRedlines}
      hasGoals={domainGoals.length > 0}
    />
  );
}
