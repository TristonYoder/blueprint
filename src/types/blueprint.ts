export type Domain = "personal" | "work" | "shared";

export interface Goal {
  id: string;
  domain: Domain;
  label: string;
}

export type RedlineKind =
  | "action" // Blueprint can resolve this in place (stamp/sign-off).
  | "reference" // Read-only — links out to the source app.
  | "sync-error"; // A source Blueprint couldn't reach — itself an obstruction.

// Small inline instrument readouts — not a chart library, two fixed forms.
// Shared by Redline (obstruction, redline-red) and Win (alignment, green) —
// same grammar, different tone.
export type CardVisual =
  | {
      kind: "meter";
      unit: string; // e.g. "$"
      spent: number;
      limit: number;
    }
  | {
      kind: "trend";
      unit: string; // e.g. "bpm"
      points: number[]; // chronological
      baseline?: number; // reference line, e.g. a 90-day average
      flagFromIndex?: number; // points at/after this index render as flagged
    };

export type CardKind = "redline" | "win";

// A margin note — Triston writing back to the agent, not the other way
// around. Read by the agent's next run via the MCP list_cards tool;
// acknowledgedAt is set only by the agent (acknowledge_comment), never by
// the UI just being viewed, so "seen" specifically means "the agent has
// processed this," distinct from a human having looked at it.
export interface Comment {
  id: string;
  cardKind: CardKind;
  cardId: string;
  body: string;
  createdAt: string; // ISO timestamp
  acknowledgedAt?: string; // ISO timestamp, set once the agent has processed it
}

export interface Redline {
  id: string;
  goalId: string;
  domain: Domain;
  kind: RedlineKind;
  title: string;
  detail: string;
  source: string; // e.g. "Actual Budget", "Asana"
  sourceHref?: string;
  actionLabel?: string; // only for kind: "action", e.g. "Categorize"
  visual?: CardVisual;
  comments?: Comment[];
}

// A deliberate positive signal — a goal genuinely on track, not routine
// "all fine" noise. Rare by design: most goals with no obstruction simply
// produce no card at all (see CleanSheet). A Win is reserved for a real,
// nameable alignment worth noting — never actionable, never red.
export interface Win {
  id: string;
  goalId: string;
  domain: Domain;
  title: string;
  detail: string;
  source: string;
  sourceHref?: string;
  visual?: CardVisual;
  comments?: Comment[];
}
