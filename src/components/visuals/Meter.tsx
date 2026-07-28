interface MeterProps {
  unit: string;
  spent: number;
  limit: number;
}

// A dimension-line style meter, not a generic progress bar: a limit tick
// marks the plan, fill shows spend against it, and any amount past the tick
// renders in the redline color — the same "obstruction" language as the
// rest of the card, not a separate chart palette.
export default function Meter({ unit, spent, limit }: MeterProps) {
  const remaining = limit - spent;
  const isOver = remaining < 0;
  const scaleMax = Math.max(spent, limit) * 1.1;
  const limitPct = (limit / scaleMax) * 100;
  const withinLimitPct = (Math.min(spent, limit) / scaleMax) * 100;
  const overflowPct = isOver ? ((spent - limit) / scaleMax) * 100 : 0;

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
          className={`bp-label font-semibold ${isOver ? "text-bp-redline" : "text-bp-ink"}`}
        >
          {remainingLabel}
        </span>
      </div>
      <div className="relative h-2 bg-bp-surface-2">
        <div
          className="absolute inset-y-0 left-0 bg-bp-ink-dim"
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
