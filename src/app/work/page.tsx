import DomainSheet from "@/components/DomainSheet";
import { goals, redlines, wins } from "@/lib/mock-data";

export default function WorkPage() {
  const domainGoals = goals.filter((g) => g.domain === "work");
  const domainRedlines = redlines.filter((r) => r.domain === "work");
  const domainWins = wins.filter((w) => w.domain === "work");

  return (
    <DomainSheet
      sheetName="WORK"
      revision="REV A"
      dateLabel="2026-07-27"
      domainLabel="Work"
      redlines={domainRedlines}
      wins={domainWins}
      hasGoals={domainGoals.length > 0}
    />
  );
}
