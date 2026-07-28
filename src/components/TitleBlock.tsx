interface TitleBlockProps {
  sheetName: string;
  revision: string;
  dateLabel: string;
  obstructionCount: number;
  hasGoals?: boolean;
}

export default function TitleBlock(props: TitleBlockProps) {
  const { sheetName, revision, dateLabel, obstructionCount, hasGoals = true } = props;

  const obstructionText = !hasGoals
    ? "NO PLAN"
    : obstructionCount === 0
      ? "ALL CLEAR"
      : `${obstructionCount} OBSTRUCTION${obstructionCount !== 1 ? "S" : ""}`;

  const obstructionColor =
    hasGoals && obstructionCount === 0 ? "text-bp-ink-dim" : hasGoals ? "text-bp-redline" : "text-bp-ink-faint";

  return (
    <div className="w-full flex justify-between items-center gap-2 px-4 py-3 sm:px-6 border-b border-bp-line-strong bg-bp-ground">
      {/* Left: BLUEPRINT branding and sheet name */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <span className="bp-label font-semibold text-bp-ink shrink-0">BLUEPRINT</span>
        <div className="w-px h-5 bg-bp-line shrink-0" />
        <span className="bp-label text-bp-ink-dim truncate">{sheetName}</span>
      </div>

      {/* Right: date (desktop only), revision (desktop only), and obstruction status */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className="bp-label text-bp-ink-faint hidden sm:inline">{dateLabel}</span>
        <div className="w-px h-5 bg-bp-line hidden sm:block" />
        <span className="bp-label text-bp-ink-faint hidden md:inline">{revision}</span>
        <div className="w-px h-5 bg-bp-line hidden md:block" />
        <span className={`bp-label whitespace-nowrap ${obstructionColor}`}>
          {obstructionText}
        </span>
      </div>
    </div>
  );
}
