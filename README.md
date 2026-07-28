# Blueprint

Personal life dashboard — compares a defined plan (financial, health, communication, and
work goals) against live state pulled from Asana, Actual Budget, Fantastical, Gmail/Outlook,
iMessage/Matrix, Home Assistant, AFFiNE, and Gatus, surfacing only where reality has drifted
from the plan. See [`PRODUCT.md`](./PRODUCT.md) for product context and
[`design-brief.md`](./design-brief.md) for the frontend/UX direction.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Postgres via Drizzle ORM — this is the app's real data now, not mock data. Point
`DATABASE_URL` at a Postgres instance (for local dev, `brew install postgresql@16` and
`createdb blueprint_dev` works fine), then:

```bash
npm run db:generate   # generate a migration from schema changes
npm run db:migrate    # apply migrations
npm run db:seed       # load mock-data.ts's content as a starting dataset
```

## Populating the board: the MCP server, not integration adapters (yet)

v1's population strategy is deliberately the simplest thing that works: Blueprint exposes
an MCP server (`src/app/api/[transport]/route.ts`, reachable at `/api/mcp`) with five tools
— `list_goals`, `list_cards`, `create_redline`, `create_win`, `resolve_redline` — and an
agent (the AIOS `daily-brief` skill, updated with a Blueprint section) calls them directly
after evaluating the real sources itself. No per-source sync workers, no scheduled jobs yet.

Connect a local Claude Code session to it with:

```bash
claude mcp add --transport http blueprint http://localhost:3211/api/mcp
```

Per PRODUCT.md's "signal, not noise" principle, every tool's description tells the calling
agent to check `list_cards` first (avoid duplicate flags) and to only create a card for a
genuine, nameable deviation or alignment — never routine status. `resolve_redline` is a hard
delete; v1 keeps no history.

Once this loop is proven out, the plan (per conversation, not yet built) is to replace
individual agent-written cards with real non-agentic sync adapters per source (Asana and
Actual Budget first — see PRODUCT.md's "Capabilities and Constraints").

## Deployment

Built as a standalone Next.js server (`output: "standalone"`). Three equivalent build
paths, matching the [stagePlotiphar](../stagePlotiphar) convention:

- `Dockerfile` + `docker-compose.yml` — plain `docker build`/`docker compose up`.
- `flake.nix` `packages.docker` — reproducible container build via `nix build .#docker`,
  used by CI (`.github/workflows/build-container.yml`, GitHub-hosted runner, pushes to
  GHCR). This is a standalone public project's CI — it doesn't depend on any private
  infra (david), unlike nix-config's own CI which legitimately targets david directly.
- `flake.nix` `packages.default` — the native (non-container) build: the same
  `buildNpmPackage` standalone output, consumed directly by nix-config's
  `modules.services.productivity.blueprint` NixOS module (no Docker layer at all).

`flake.nix`'s `npmDepsHash` and `flake.lock` are kept fresh automatically —
`.github/workflows/update-nix-hashes.yml` recomputes `npmDepsHash` whenever
`package-lock.json` changes (plus a weekly backstop), and
`.github/workflows/update-flake-lock.yml` runs `nix flake update` weekly. Both verify
`nix build .#default` still succeeds before committing.

Deploys onto the home NixOS server (`david`) as a native systemd service (not a
container) behind Caddy via nix-config's `vHosts` registry, at `blueprint.tristonyoder.com`
— internal-only (no public Cloudflare Tunnel exposure). Secrets are supplied via agenix,
the same mechanism used for the rest of that infra — see `~/Projects/nix-config`.

**Not yet wired up / open items:**
- No `DATABASE_URL`/secrets wired via agenix yet — local dev currently points at a
  Homebrew-installed Postgres on this Mac, not `david`'s.
- The MCP endpoint has no auth yet — fine for local-only use, not for exposing beyond
  the tailnet.
- Goal-authoring UI still doesn't exist — goals are seeded from `mock-data.ts` by hand.
