import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import SheetTabs from "@/components/SheetTabs";
import "./globals.css";

// IBM Plex: designed for technical/engineering documentation, with monospace
// numerals — the register this drafting-sheet UI actually needs, not a
// default app-shell face.
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

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
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bp-ground text-bp-ink">
        <SheetTabs />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
