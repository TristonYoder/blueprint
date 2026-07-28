import OverviewSheet from "@/components/OverviewSheet";
import { goals, redlines, wins } from "@/lib/mock-data";

export default function OverviewPage() {
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
