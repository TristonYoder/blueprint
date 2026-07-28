import OverviewSheet from "@/components/OverviewSheet";
import { getGoals, getRedlines, getWins } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const [goals, redlines, wins] = await Promise.all([getGoals(), getRedlines(), getWins()]);

  return (
    <OverviewSheet
      revision="REV A"
      dateLabel="2026-07-27"
      redlines={redlines}
      wins={wins}
      goals={goals}
    />
  );
}
