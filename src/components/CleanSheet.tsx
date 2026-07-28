interface CleanSheetProps {
  domainLabel: string;
}

export default function CleanSheet(props: CleanSheetProps) {
  return (
    <div className="flex items-center justify-center flex-col text-center min-h-[50vh]">
      <div className="bp-label text-bp-ink">SHEET CLEAR</div>
      <div className="text-bp-ink-dim mt-2">
        {props.domainLabel} matches the plan. Nothing to redline.
      </div>
    </div>
  );
}
