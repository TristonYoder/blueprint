# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Single user: Triston Yoder. Not multi-tenant, no accounts/roles system — this is a personal instrument panel, not a shared product. Caroline (wife) is explicitly out of scope for direct access; she continues to receive the separate daily-brief TL;DR via iMessage from the existing AIOS system, not through Blueprint itself.

Usage context: checked with equal weight on desktop (workstation/laptop, on the Tailscale network) and phone (quick glances throughout the day). No dominant device — both are first-class targets from the start, not a primary/secondary pair.

## Product Purpose

Blueprint is not a notification feed — it's an instrument for keeping Triston's actual life on the plan he's set for it. "Blueprint" names a real artifact: a defined set of goals across financial, health, communication, and work domains — the "as-designed" state. The dashboard continuously compares that plan against "as-built" reality, pulled from Triston's fragmented life-management systems (Asana, Actual Budget, Fantastical, Gmail + Outlook, iMessage + Matrix, Home Assistant, AFFiNE, and the home server's own Gatus uptime monitoring), and surfaces only where reality has drifted from the plan — an obstruction to a goal, not just an unread item.

Success is not "see everything in one place" and not merely "see only exceptions" — it's **being reoriented toward the goals themselves**. A card exists because something is in the way of a stated financial, health, communication, or work goal, not because an inbox has unread mail. A healthy system, an on-time task, a categorized transaction produce nothing. An obstruction — a budget category trending off-plan, a health metric off-track, a relationship/communication goal going quiet, a work goal stalling — produces a card. The dashboard's job is to be quiet almost all the time and, when it isn't, to point back at the plan, not just the raw event.

## Positioning

Not a launcher (Homepage/Gatus already fill that role on the home server) and not a Notion-style all-in-one workspace (AFFiNE fills that role for notes). Not a to-do list or reminders app either — Blueprint's distinct mechanism: a rule-first, LLM-assisted **goal-obstruction layer**, comparing a defined life plan (the blueprint) against live state pulled from every system Triston already uses, and surfacing only the deviations that matter. Every other personal dashboard he could adopt off the shelf either shows everything (noisy), replaces the source apps (disruptive), or tracks tasks without reference to a larger goal (reminders, not orientation); Blueprint does none of those — it reads from the existing tools of record, evaluates them against the stated plan, and, for a deliberately small set of domains, can act back into them (complete a task, categorize a transaction) without becoming the system of record itself.

## Operating Context

- Hosted on Triston's home NixOS server (`david`), reverse-proxied through Caddy via the existing `vHosts` registry, reachable only inside his Tailscale network — no public internet exposure, no public login flow.
- Sits alongside existing infrastructure it should reuse rather than duplicate: LiteLLM (unified LLM gateway) for any discernment/summarization calls, shared PostgreSQL for its own state, agenix for secrets, and the existing AIOS "signal, not noise" precedent from the daily-brief Cowork skill.
- Two-tier interaction model per domain:
  - **Action-capable:** Asana (mark tasks complete), Actual Budget (categorize transactions) — write-back into the source app.
  - **Read-only / display-only:** email, comms (iMessage/Matrix), calendar (Fantastical), Home Assistant state, notes (AFFiNE) — surfaced for awareness, with a link back to the source app rather than an in-dashboard editing surface.
- Domain grouping: Personal (AFFiNE, Actual Budget, iMessage/Matrix, Gmail, Home Assistant), Work (Asana, Outlook, Teams), Both (Fantastical calendar). This grouping is a confirmed product fact from earlier planning, not yet a confirmed navigation/IA decision — that's shape/new-work's job.
- Related but distinct system: the AIOS daily-brief skill (a scheduled digest note + audio + iMessage summary) and the Hermes conversational agent (Matrix-based, migrating its memory store to AFFiNE) both apply similar "what matters today" discernment logic on an separate cadence. Blueprint is the live/pull dashboard version of that same instinct — the three should eventually share a signal-evaluation approach rather than diverge, though that integration work is out of scope for the initial build.

## Capabilities and Constraints

- Blueprint owns a concept no source app provides: **the plan itself** — Triston-authored goals per domain (financial targets, health targets, communication/relationship cadence, work goals), stored in Blueprint, not pulled from anywhere. Every integration's live data gets evaluated against this plan, not surfaced on its own terms. Authoring/editing the plan is itself a Blueprint capability, not just consuming external data — open decision for the build phase is how structured/freeform that goal definition is (e.g. numeric targets like a budget ceiling vs. qualitative goals like "check in with a specific friend monthly").
- Confirmed integrations at launch: Asana, Actual Budget, Fantastical, Gmail, Outlook, iMessage, Matrix, Home Assistant, AFFiNE, Gatus (server health).
- LLM calls are scoped narrowly to relevance/discernment and phrasing ("is this worth a card, how should it read") — never to logic a rule or API field can already answer (up/down status, categorized-or-not, overdue-or-not are always plain code).
- No frontend framework chosen yet — open decision for the shape/build phase.
- No public-facing auth system needed for v1 (Tailscale is the access boundary); this may change if exposure requirements change later.
- AFFiNE is treated as the eventual notes backend; the Notion/Obsidian → AFFiNE content migration itself is a separate, out-of-scope effort.

## Evidence on Hand

- Existing AIOS daily-brief skill (`AIOS/skills/general/daily-brief.md` in the Obsidian vault) is the working precedent for "exception-only, sub-agent-sourced, don't repeat routine state" — reuse its filtering instinct, not its file format.
- Existing `nix-config` infra survey (vHosts registry, Caddy, LiteLLM, Postgres, agenix, Gatus, Homepage) establishes what Blueprint can plug into rather than rebuild.
- No existing visual identity, logo, or UI code for Blueprint yet — this is a from-scratch build.

## Product Principles

1. **Orient toward the plan, not the inbox.** Every card traces back to a stated goal (financial, health, communication, or work) — Blueprint surfaces obstructions to the plan, not raw unread/overdue events for their own sake.
2. **Silence is the default state.** Every card-producing check must define both when it fires and when it deliberately stays silent; a quiet dashboard is the success case, not an empty one.
3. **Rules first, LLM last.** Deterministic checks (status, categorization, due dates, threshold comparisons against the plan) never go through an LLM; the LLM's only job is judging ambiguous relevance and writing the card's phrasing.
4. **Read from the source of truth, don't replace it.** Blueprint mirrors and, for a small set of domains, writes back to existing tools — it is never the system of record for tasks, budget, calendar, or notes. (It is, however, the system of record for the plan/goals themselves — nothing else holds those.)
5. **Reuse the home server's own infrastructure.** New integrations plug into the existing vHosts/Caddy/Postgres/agenix/LiteLLM patterns rather than standing up parallel infrastructure.
6. **Equally good on desktop and phone.** No primary device to design around — both are daily, real usage contexts from day one.

## Accessibility & Inclusion

No product-specific accessibility requirement established beyond standard web accessibility practice (single sighted user, no stated assistive-technology need) — build to normal WCAG-conscious defaults rather than a specific accommodation.
