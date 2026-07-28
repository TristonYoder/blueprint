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

Postgres via Drizzle ORM. Point `DATABASE_URL` at a Postgres instance, then:

```bash
npm run db:generate   # generate a migration from schema changes
npm run db:migrate    # apply migrations
```

## Deployment

Built as a standalone Next.js server (`output: "standalone"`) into a container. Two
equivalent build paths, matching the [stagePlotiphar](../stagePlotiphar) convention:

- `Dockerfile` + `docker-compose.yml` — plain `docker build`/`docker compose up`.
- `flake.nix` — reproducible build via `nix build .#docker`, used by CI
  (`.github/workflows/build-container.yml`, self-hosted `david` runner, pushes to GHCR).

Deploys onto the home NixOS server (`david`) behind Caddy via nix-config's `vHosts`
registry, Tailscale-only (no public exposure). Secrets are supplied via agenix, the same
mechanism used for the rest of that infra — see `~/Projects/nix-config`.

**Not yet wired up / open items:**
- `flake.nix`'s `npmDepsHash` is a placeholder — regenerate once dependencies settle
  (`nix run nixpkgs#prefetch-npm-deps -- package-lock.json`), and run `nix flake check`
  on the actual NixOS host (never locally on macOS — see nix-config's own convention).
- No `vHosts` entry in nix-config yet, no `DATABASE_URL`/secrets wired via agenix yet.
- No app code yet — this is infra scaffolding only.
