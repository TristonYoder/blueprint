import DomainSheet from "@/components/DomainSheet";
import { goals, redlines } from "@/lib/mock-data";

export default function OverviewPage() {
  return (
    <DomainSheet
      sheetName="OVERVIEW"
      revision="REV A"
      dateLabel="2026-07-27"
      domainLabel="Your plan"
      redlines={redlines}
      hasGoals={goals.length > 0}
    />
  );
}
