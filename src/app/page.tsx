export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-black text-zinc-100">
      <main className="flex flex-col items-center gap-2 px-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Blueprint</h1>
        <p className="max-w-md text-sm text-zinc-400">
          Infra scaffold only — see PRODUCT.md and design-brief.md. The
          overview sheet UI hasn&apos;t been built yet.
        </p>
      </main>
    </div>
  );
}
