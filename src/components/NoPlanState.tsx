interface NoPlanStateProps {
  domainLabel: string;
  compact?: boolean;
}

export default function NoPlanState({ domainLabel, compact = false }: NoPlanStateProps) {
  return (
    <div
      className={`flex items-center justify-center flex-col text-center ${compact ? "min-h-[140px]" : "min-h-[50vh]"}`}
    >
      <div
        className={`border border-dashed border-bp-line-strong mx-auto ${compact ? "p-6 max-w-full" : "p-12 max-w-md"}`}
      >
        <div className="bp-label text-bp-ink-dim">NO PLAN ON FILE</div>
        <div className="text-bp-ink-faint mt-2 text-sm">
          No goals defined yet for {domainLabel}. Blueprint has nothing to compare against.
        </div>
      </div>
    </div>
  );
}
