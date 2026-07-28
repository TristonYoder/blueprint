interface NoPlanStateProps {
  domainLabel: string;
}

export default function NoPlanState(props: NoPlanStateProps) {
  return (
    <div className="flex items-center justify-center flex-col text-center min-h-[50vh]">
      <div className="border border-dashed border-bp-line-strong p-12 max-w-md mx-auto">
        <div className="bp-label text-bp-ink-dim">NO PLAN ON FILE</div>
        <div className="text-bp-ink-faint mt-2">
          No goals defined yet for {props.domainLabel}. Blueprint has nothing to compare against.
        </div>
      </div>
    </div>
  );
}
