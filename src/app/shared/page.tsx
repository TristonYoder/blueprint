import DomainSheet from "@/components/DomainSheet";
import { getGoals, getRedlines, getWins } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

// No "shared" goals seeded yet — deliberately demonstrates the "no plan on
// file" state (distinct from all-clear) called out in design-brief.md.
export default async function SharedPage() {
  const [goals, redlines, wins] = await Promise.all([getGoals(), getRedlines(), getWins()]);
  const domainGoals = goals.filter((g) => g.domain === "shared");
  const domainRedlines = redlines.filter((r) => r.domain === "shared");
  const domainWins = wins.filter((w) => w.domain === "shared");

  return (
    <DomainSheet
      sheetName="SHARED"
      revision="REV A"
      dateLabel="2026-07-27"
      domainLabel="Shared"
      redlines={domainRedlines}
      wins={domainWins}
      hasGoals={domainGoals.length > 0}
    />
  );
}
