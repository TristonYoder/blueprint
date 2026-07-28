import DomainSheet from "@/components/DomainSheet";
import { goals, redlines, wins } from "@/lib/mock-data";

export default function PersonalPage() {
  const domainGoals = goals.filter((g) => g.domain === "personal");
  const domainRedlines = redlines.filter((r) => r.domain === "personal");
  const domainWins = wins.filter((w) => w.domain === "personal");

  return (
    <DomainSheet
      sheetName="PERSONAL"
      revision="REV A"
      dateLabel="2026-07-27"
      domainLabel="Personal"
      redlines={domainRedlines}
      wins={domainWins}
      hasGoals={domainGoals.length > 0}
    />
  );
}
