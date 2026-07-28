# Blueprint — Frontend Design Brief

## 1. Job and audience

Triston, solo user, checking in a few times a day (deliberate sit-down check-ins, not constant background glances), equally on desktop and phone. Mode: **Operate** — this is a tool for completing a scan-and-act loop, not persuading or entertaining. Job: know, at a glance, where his actual life has drifted from the plan he's set for it, across financial, health, communication, and work goals — and either resolve it in place or jump to the source app to resolve it there.

## 2. Outcome and proof

Primary action: scan for obstructions, act on the ones Blueprint can act on (mark resolved, categorize, complete), route out to the source app for the rest. Success is a mostly-empty, calm surface — Blueprint proves its worth by staying quiet, not by showing activity. The "evidence" this surface carries is Triston's own plan (goals he defines) compared against live pulls from Asana, Actual Budget, Fantastical, Gmail/Outlook, iMessage/Matrix, Home Assistant, AFFiNE, and Gatus.

## 3. Selected direction

**Committed direction — "Blueprint & As-Built."** Chosen by direct user steer ("lean into the blueprint idea") over the randomized concept process, fusing two grounded candidates from that process: the architectural blueprint/drafting-sheet world, and the field-notebook/as-built-record mechanism (in construction, an "as-built" drawing redlines wherever real construction departed from the original blueprint — an exact structural match for "obstruction to the plan").

- **THESIS.** Blueprint is not a card feed — it's the as-built check against your own life's blueprint. Refuses the generic "dashboard of cards" in favor of one continuous comparison: plan vs. reality.
- **OWN-WORLD.** Architectural drawing language: cyan-and-white blueprint linework as the calm "as-designed" ground layer; red-pencil redline marks as the *only* saturated color, appearing exclusively where reality has drifted from plan; a title-block header strap (project name, date, revision number, like a real drawing set); domain views are separate numbered sheets (A-101 Personal, A-201 Work, A-301 Shared) rather than a generic nav sidebar; clearing an obstruction is an inspector's stamp/sign-off, not a checkbox tick — a small, real professional ritual, not a game mechanic. (Correction from earlier: light, earned "gamification" is fine here — a stamp/sign-off moment reads as satisfying, not childish, as long as it's played straight rather than winking at itself.)
- **STORY.** Triston opens his own plan. A clean cyan sheet, no red marks: the blueprint and reality still match — a genuinely good thing to see, not just an absence. A red mark means something drifted from a stated goal; he reads it like a punch-list item and either stamps it resolved (action-capable domains) or follows it to the source sheet (read-only domains).
- **FIRST VIEWPORT.** Full-bleed blueprint sheet. Title-block strap across the top (today's date, revision state, one-line overall status). Linework grid as the quiet background. Redlines, when present, are the only color in the frame — sized and positioned like real drafting call-outs, not uniform card tiles. Sheet-selector tabs (Personal / Work / Both) sit like a real drawing set's index, not a top-nav bar.
- **FORM.** User-pinned direction; supersedes the rolled assignment. No re-roll needed — a pinned direction beats the roll by rule.

## 4. Scope and boundaries

Full flow: home/overview sheet, the three domain sheets (Personal, Work, Both), a redline detail/expand state, and the two card behaviors (action-capable stamp-to-resolve vs. read-only see-source reference). Fidelity: production-ready screens and states, not a moodboard — this brief is meant to be built from. Untouched/out of scope for this pass: actual goal-authoring UI (defining the plan itself is a real capability per PRODUCT.md but its own design pass), AFFiNE notes migration, Hermes agent work, backend/integration architecture (already captured in the earlier infra plan). Anti-goals: no generic SaaS dashboard chrome (rounded shadow cards, gradient icon tiles); no literal skeuomorphic clutter (no fake paper texture/grain overload, no cutesy hand-wobble on every line — this is a precise drafting hand, not a bullet journal).

## 5. States and ranges

- **All-clear (default, most common state):** zero redlines. Designed as a genuinely good moment to see, not just an empty list — the clean sheet itself, title block reading full status, is the reward.
- **Typical day:** a handful of redlines, one or two domains affected.
- **Busy day:** 5-10+ redlines possible, could spike higher — the sheet layout must stay legible at this density (grouping by domain sheet, not one long undifferentiated list on the home view).
- **First-run / no plan defined yet:** Blueprint has nothing to compare against until goals are authored — needs an honest "no plan on file yet" state distinct from all-clear, prompting goal authoring rather than implying false success.
- **Integration/loading/error:** a source failing to sync (e.g. Gmail auth expired) is itself a kind of obstruction — surfaces as its own redline ("Blueprint can't see Gmail right now"), not a silent gap or generic spinner.
- **Detail/expand:** tapping a redline opens its call-out — full context, the goal it traces back to, and its action (stamp to resolve / link to source).

## 6. Interaction and layout

- **Hierarchy:** title-block status line > redlines (only content that fights for attention) > quiet linework everywhere else. Nothing renders with card-style elevation/shadow by default — redlines earn visual weight, the rest of the sheet recedes.
- **Topology:** home = overview sheet aggregating redlines across all domains; three domain sheets reached via tab/index selector, each scoped to its own goals; a redline's detail is an in-place expand, not a route change, to keep the scan-and-act loop fast.
- **Responsive:** phone = single sheet at a time, title strap condensed to date + status count; desktop = same sheet, more breathing room, possibly two sheets visible at once (overview + one domain) for the desk check-in context.
- **Affordances:** action-capable redlines carry a stamp/sign-off control inline; read-only redlines carry a small "see: [source]" reference mark that jumps out — visually distinct at a glance (e.g. stamp icon vs. arrow-out icon) so Triston never has to guess which behavior a redline offers before touching it.
- **Feedback/transition:** a new obstruction doesn't just appear — it draws in like a real redline mark being added to the sheet (a deliberate, brief "someone just marked this up" motion, not a bouncy notification pop). Resolving one plays the stamp/sign-off motion, then the mark clears back to clean linework.

## 7. Constraints and open decisions

- No frontend framework chosen yet — open for the build phase (earlier infra plan suggested Next.js as a reasonable default; not binding).
- Typography/exact palette values (blueprint cyan, redline red, linework weight) are art-direction decisions for the build pass, not fixed here — this brief commits the *system*, not the tokens.
- Goal-authoring UI (how Triston actually defines/edits the plan) is a named open decision, deliberately out of scope for this brief.
- DESIGN.md (durable token/system record) gets written at the start of the actual build, not during this planning pass.
