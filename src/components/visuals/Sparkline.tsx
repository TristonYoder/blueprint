interface SparklineProps {
  unit: string;
  points: number[];
  baseline?: number;
  flagFromIndex?: number;
}

const WIDTH = 220;
const HEIGHT = 48;
const PAD_Y = 8;

function toPath(points: number[], min: number, max: number, from: number, to: number) {
  const n = points.length;
  const range = max - min || 1;
  return points
    .slice(from, to + 1)
    .map((value, i) => {
      const index = from + i;
      const x = (index / (n - 1)) * WIDTH;
      const y = HEIGHT - PAD_Y - ((value - min) / range) * (HEIGHT - PAD_Y * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

// A trend line, not a full chart: the "since here" tick marks where the
// obstruction starts, echoing the same reference-tick language as the
// budget meter's limit line, rather than inventing a second visual grammar.
export default function Sparkline({ unit, points, baseline, flagFromIndex }: SparklineProps) {
  if (points.length < 2) return null;

  const flagFrom = flagFromIndex ?? points.length;
  const allValues = baseline !== undefined ? [...points, baseline] : points;
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const n = points.length;

  const normalPath = toPath(points, min, max, 0, Math.min(flagFrom, n - 1));
  const flaggedPath =
    flagFrom < n - 1 || flagFrom === 0 ? toPath(points, min, max, flagFrom, n - 1) : "";

  const lastIndex = n - 1;
  const lastX = (lastIndex / (n - 1)) * WIDTH;
  const lastY = HEIGHT - PAD_Y - ((points[lastIndex] - min) / (max - min || 1)) * (HEIGHT - PAD_Y * 2);
  const isFlaggedEnd = lastIndex >= flagFrom;

  const baselineY =
    baseline !== undefined
      ? HEIGHT - PAD_Y - ((baseline - min) / (max - min || 1)) * (HEIGHT - PAD_Y * 2)
      : null;

  const flagX = flagFrom < n ? (flagFrom / (n - 1)) * WIDTH : null;

  return (
    <div className="flex items-center gap-3">
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="shrink-0"
        role="img"
        aria-label={`Trend: ${points[0]} to ${points[lastIndex]} ${unit}${baseline !== undefined ? `, baseline ${baseline} ${unit}` : ""}`}
      >
        {baselineY !== null && (
          <line
            x1={0}
            x2={WIDTH}
            y1={baselineY}
            y2={baselineY}
            className="stroke-bp-line-strong"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        )}
        {flagX !== null && (
          <line
            x1={flagX}
            x2={flagX}
            y1={0}
            y2={HEIGHT}
            className="stroke-bp-line-strong"
            strokeWidth={1}
          />
        )}
        <path d={normalPath} fill="none" className="stroke-bp-ink-dim" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {flaggedPath && (
          <path d={flaggedPath} fill="none" className="stroke-bp-redline" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        )}
        <circle
          cx={lastX}
          cy={lastY}
          r={4}
          className={`stroke-bp-surface ${isFlaggedEnd ? "fill-bp-redline" : "fill-bp-ink"}`}
          strokeWidth={2}
        />
      </svg>
      <div className="flex flex-col">
        <span className={`bp-label font-semibold ${isFlaggedEnd ? "text-bp-redline" : "text-bp-ink"}`}>
          {points[lastIndex]}
          {unit}
        </span>
        {baseline !== undefined && (
          <span className="bp-label text-bp-ink-faint">baseline {baseline}{unit}</span>
        )}
      </div>
    </div>
  );
}
