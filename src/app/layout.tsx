import type { Metadata } from "next";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import SheetTabs from "@/components/SheetTabs";
import "./globals.css";

// IBM Plex: designed for technical/engineering documentation, with monospace
// numerals — the register this drafting-sheet UI actually needs, not a
// default app-shell face. Self-hosted via @fontsource (not next/font/google)
// because next/font/google fetches from Google Fonts at build time, which
// can't work in a network-sandboxed Nix build (see nix-config's
// blueprint.nix) — same reason stagePlotiphar self-hosts its own font.
export const metadata: Metadata = {
  title: "Blueprint",
  description: "Plan vs. reality, across the goals that matter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bp-ground text-bp-ink">
        <SheetTabs />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
