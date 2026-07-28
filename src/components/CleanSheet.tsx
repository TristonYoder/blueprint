interface CleanSheetProps {
  domainLabel: string;
  compact?: boolean;
}

export default function CleanSheet({ domainLabel, compact = false }: CleanSheetProps) {
  return (
    <div
      className={`flex items-center justify-center flex-col text-center ${compact ? "min-h-[140px]" : "min-h-[50vh]"}`}
    >
      <div className="bp-label text-bp-ink">SHEET CLEAR</div>
      <div className="text-bp-ink-dim mt-2 text-sm">
        {domainLabel} matches the plan. Nothing to redline.
      </div>
    </div>
  );
}
