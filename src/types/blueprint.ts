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
}
