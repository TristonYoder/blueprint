import type { Goal, Redline, Win } from "@/types/blueprint";

// Sample data standing in for the real integration layer (Asana, Actual
// Budget, Fantastical, Gmail/Outlook, iMessage/Matrix, Home Assistant,
// AFFiNE, Gatus) — see PRODUCT.md. Demonstrates the state ranges called out
// in design-brief.md: a typical day, a busy day, a sync error, and the
// all-clear sheet (Shared domain has no goals yet — the "no plan on file"
// state, distinct from all-clear).

export const goals: Goal[] = [
  { id: "goal-budget", domain: "personal", label: "Groceries under $900/mo" },
  { id: "goal-health", domain: "personal", label: "Resting HR trend, weekly check" },
  { id: "goal-comms", domain: "personal", label: "Check in with Dad monthly" },
  { id: "goal-server", domain: "personal", label: "Home server stays healthy" },
  { id: "goal-dining", domain: "personal", label: "Dining out under $200/mo" },
  { id: "goal-sprint", domain: "work", label: "Ministry sprint on track" },
  { id: "goal-inbox", domain: "work", label: "No stale unanswered emails" },
  { id: "goal-response", domain: "work", label: "Reply to Campus TDs within 48h" },
];

export const redlines: Redline[] = [
  {
    id: "rl-1",
    goalId: "goal-budget",
    domain: "personal",
    kind: "action",
    title: "3 transactions uncategorized",
    detail:
      "Groceries run is $340 over plan for the month once these are filed — Actual Budget has them sitting in Uncategorized.",
    source: "Actual Budget",
    actionLabel: "Categorize",
    visual: { kind: "meter", unit: "$", spent: 1240, limit: 900 },
  },
  {
    id: "rl-2",
    goalId: "goal-health",
    domain: "personal",
    kind: "reference",
    title: "Resting heart rate up 6 bpm this week",
    detail: "Apple Health shows a sustained rise against your 90-day baseline — worth a look before it's a trend.",
    source: "Apple Health",
    sourceHref: "#",
    visual: {
      kind: "trend",
      unit: " bpm",
      points: [57, 58, 56, 59, 58, 57, 59, 60, 61, 62, 63, 64, 63, 65],
      baseline: 58,
      flagFromIndex: 7,
    },
  },
  {
    id: "rl-3",
    goalId: "goal-comms",
    domain: "personal",
    kind: "reference",
    title: "No contact with Dad in 5 weeks",
    detail: "Last iMessage thread activity was 5 weeks ago — past your monthly check-in goal.",
    source: "iMessage",
    sourceHref: "#",
  },
  {
    id: "rl-4",
    goalId: "goal-server",
    domain: "personal",
    kind: "sync-error",
    title: "Blueprint can't see Gmail right now",
    detail: "OAuth token expired 2 hours ago — personal inbox obstructions may be stale until this is re-authorized.",
    source: "Gmail",
    sourceHref: "#",
  },
  {
    id: "rl-5",
    goalId: "goal-sprint",
    domain: "work",
    kind: "action",
    title: "“Update stage plot template” is 2 days overdue",
    detail: "Blocking the rest of this sprint's checklist in Asana.",
    source: "Asana",
    actionLabel: "Mark complete",
  },
  {
    id: "rl-6",
    goalId: "goal-inbox",
    domain: "work",
    kind: "reference",
    title: "Campus TD email waiting 4 days",
    detail: "“Ross Ultrix routing question” from a Campus TD hasn't had a reply since Monday.",
    source: "Outlook",
    sourceHref: "#",
  },
  {
    id: "rl-7",
    goalId: "goal-inbox",
    domain: "work",
    kind: "action",
    title: "2 more Asana tasks overdue",
    detail: "Both sit under this week's sprint board, past their due date.",
    source: "Asana",
    actionLabel: "Review",
  },
];

// A couple of deliberate wins — real, nameable alignment worth noting, not
// routine "all fine" status. Most goals with no obstruction just produce no
// card at all (CleanSheet); these two are here specifically to demonstrate
// the win-card treatment.
export const wins: Win[] = [
  {
    id: "win-1",
    goalId: "goal-dining",
    domain: "personal",
    title: "Dining out on track",
    detail: "Well under plan with a week left in the month — nothing to file, nothing to flag.",
    source: "Actual Budget",
    sourceHref: "#",
    visual: { kind: "meter", unit: "$", spent: 140, limit: 200 },
  },
  {
    id: "win-2",
    goalId: "goal-response",
    domain: "work",
    title: "Campus TD reply time down to 36 hrs",
    detail: "Trending well under your 48-hour target for two weeks straight.",
    source: "Outlook",
    sourceHref: "#",
    visual: {
      kind: "trend",
      unit: " hrs",
      points: [72, 68, 65, 60, 52, 48, 40, 36],
      baseline: 48,
      flagFromIndex: 3,
    },
  },
];
