interface MeterProps {
  unit: string;
  spent: number;
  limit: number;
  /** "neutral" (default) reads as a plain fact — used on obstruction cards,
   * where any overflow past the limit always renders in redline red
   * regardless of tone. "positive" is for Win cards: a goal genuinely
   * within plan, filled in the same green used for a resolved stamp. */
  tone?: "neutral" | "positive";
}

// A dimension-line style meter, not a generic progress bar: a limit tick
// marks the plan, fill shows spend against it, and any amount past the tick
// renders in the redline color — the same "obstruction" language as the
// rest of the card, not a separate chart palette.
export default function Meter({ unit, spent, limit, tone = "neutral" }: MeterProps) {
  const remaining = limit - spent;
  const isOver = remaining < 0;
  const scaleMax = Math.max(spent, limit) * 1.1;
  const limitPct = (limit / scaleMax) * 100;
  const withinLimitPct = (Math.min(spent, limit) / scaleMax) * 100;
  const overflowPct = isOver ? ((spent - limit) / scaleMax) * 100 : 0;
  const isPositive = tone === "positive" && !isOver;

  const remainingLabel = isOver
    ? `${unit}${Math.abs(remaining).toLocaleString()} OVER`
    : `${unit}${remaining.toLocaleString()} LEFT`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="bp-label text-bp-ink-faint">
          {unit}
          {spent.toLocaleString()} of {unit}
          {limit.toLocaleString()}
        </span>
        <span
          className={`bp-label font-semibold ${isOver ? "text-bp-redline" : isPositive ? "text-bp-stamp" : "text-bp-ink"}`}
        >
          {remainingLabel}
        </span>
      </div>
      <div className="relative h-2 bg-bp-surface-2">
        <div
          className={`absolute inset-y-0 left-0 ${isPositive ? "bg-bp-stamp" : "bg-bp-ink-dim"}`}
          style={{ width: `${withinLimitPct}%` }}
        />
        {isOver && (
          <div
            className="absolute inset-y-0 bg-bp-redline"
            style={{ left: `${limitPct}%`, width: `${overflowPct}%` }}
          />
        )}
        {/* Limit tick — the plan's line, drawn like a drafting dimension mark */}
        <div
          className="absolute -top-1 -bottom-1 w-0.5 bg-bp-line-strong"
          style={{ left: `${limitPct}%` }}
          title={`Plan limit: ${unit}${limit.toLocaleString()}`}
        />
      </div>
    </div>
  );
}
