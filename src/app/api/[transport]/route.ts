import { createMcpHandler } from "mcp-handler";
import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import {
  getGoals,
  getRedlines,
  getWins,
  createRedline,
  createWin,
  removeRedline,
  acknowledgeComment,
} from "@/lib/db/queries";

const DOMAIN = z.enum(["personal", "work", "shared"]);
const REDLINE_KIND = z.enum(["action", "reference", "sync-error"]);

const VISUAL = z
  .union([
    z.object({
      kind: z.literal("meter"),
      unit: z.string().describe('e.g. "$"'),
      spent: z.number(),
      limit: z.number(),
    }),
    z.object({
      kind: z.literal("trend"),
      unit: z.string().describe('e.g. " bpm"'),
      points: z.array(z.number()).describe("chronological values"),
      baseline: z.number().optional(),
      flagFromIndex: z
        .number()
        .optional()
        .describe("index at/after which points render as flagged"),
    }),
  ])
  .optional()
  .describe(
    "Optional inline instrument readout — a meter (spend vs. limit) or a trend line. Only include when you have real numbers; omit rather than approximate.",
  );

// Every tool here is meant for an agent (e.g. the daily-brief skill)
// re-evaluating Blueprint's plan against live sources, not for a human.
// See PRODUCT.md's "signal, not noise" principle: only call create_redline
// or create_win for a genuine, nameable deviation or alignment — never to
// report routine "still fine" status, and always check list_cards first to
// avoid creating a duplicate of something already flagged.
const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "list_goals",
      {
        title: "List goals",
        description:
          "List the goals defined in Blueprint's plan (financial, health, communication, work), optionally filtered by domain. Use this to find the goalId to attach a new redline or win to — never invent a goalId.",
        inputSchema: { domain: DOMAIN.optional() },
      },
      async ({ domain }) => {
        const goals = await getGoals();
        const filtered = domain ? goals.filter((g) => g.domain === domain) : goals;
        return { content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }] };
      },
    );

    server.registerTool(
      "list_cards",
      {
        title: "List active cards",
        description:
          "List every currently active redline (obstruction) and win (alignment) on the board, optionally filtered by domain, each with its comments array. Always call this before creating a card, to avoid duplicating one that's already flagged. Check every card's comments for one with no acknowledgedAt — that's Triston writing back a correction since your last run (e.g. 'I already called him, this is stale'). Weigh it the same way the daily-brief skill weighs a handwritten note: don't silently overwrite it, verify against it, then call resolve_redline or acknowledge_comment once you've acted on it.",
        inputSchema: { domain: DOMAIN.optional() },
      },
      async ({ domain }) => {
        const [redlines, wins] = await Promise.all([getRedlines(), getWins()]);
        const filteredRedlines = domain ? redlines.filter((r) => r.domain === domain) : redlines;
        const filteredWins = domain ? wins.filter((w) => w.domain === domain) : wins;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ redlines: filteredRedlines, wins: filteredWins }, null, 2),
            },
          ],
        };
      },
    );

    server.registerTool(
      "create_redline",
      {
        title: "Create a redline (obstruction)",
        description:
          "Flag a genuine deviation from the plan — something in the way of a stated goal. Never call this for routine status; a goal with nothing wrong should produce no card at all. kind: \"action\" if Blueprint's UI can resolve it in place (set actionLabel, e.g. \"Categorize\"), \"reference\" if it's read-only awareness with a link out (set sourceHref), \"sync-error\" if a data source itself is unreachable.",
        inputSchema: {
          goalId: z.string(),
          domain: DOMAIN,
          kind: REDLINE_KIND,
          title: z.string().describe("Short headline, e.g. \"3 transactions uncategorized\""),
          detail: z.string().describe("One or two sentences of context"),
          source: z.string().describe('e.g. "Actual Budget", "Asana"'),
          sourceHref: z.string().optional(),
          actionLabel: z.string().optional().describe('Required for kind "action", e.g. "Categorize"'),
          visual: VISUAL,
        },
      },
      async (input) => {
        const id = `rl-${randomUUID()}`;
        await createRedline({ id, ...input });
        return { content: [{ type: "text", text: `Created redline ${id}` }] };
      },
    );

    server.registerTool(
      "create_win",
      {
        title: "Create a win (alignment)",
        description:
          "Note a genuine, nameable alignment worth surfacing — never routine \"all fine\" status. Reserve this for something specific: a category well under plan, a trend recovering past a target. Never actionable, never red.",
        inputSchema: {
          goalId: z.string(),
          domain: DOMAIN,
          title: z.string(),
          detail: z.string(),
          source: z.string(),
          sourceHref: z.string().optional(),
          visual: VISUAL,
        },
      },
      async (input) => {
        const id = `win-${randomUUID()}`;
        await createWin({ id, ...input });
        return { content: [{ type: "text", text: `Created win ${id}` }] };
      },
    );

    server.registerTool(
      "resolve_redline",
      {
        title: "Resolve / clear a redline",
        description:
          "Remove a redline — either because you resolved it directly, or because re-checking the source shows it no longer applies. There's no history kept; this is a hard removal.",
        inputSchema: { id: z.string() },
      },
      async ({ id }) => {
        await removeRedline(id);
        return { content: [{ type: "text", text: `Removed redline ${id}` }] };
      },
    );

    server.registerTool(
      "acknowledge_comment",
      {
        title: "Acknowledge a comment",
        description:
          "Mark a comment as seen, once you've acted on it — verified it, adjusted the card, or resolved it. Only call this after actually reading and weighing the comment, not as a formality; an unacknowledged comment is the signal that a correction is still outstanding.",
        inputSchema: { id: z.string() },
      },
      async ({ id }) => {
        await acknowledgeComment(id);
        return { content: [{ type: "text", text: `Acknowledged comment ${id}` }] };
      },
    );
  },
  {},
  { basePath: "/api", verboseLogs: true },
);

// This endpoint can create/resolve cards — bearer-token gated once
// MCP_AUTH_TOKEN is set (real deployments). Unset in local dev, where
// there's nothing to protect. NEXT_PUBLIC_-free on purpose: never sent to
// the client, only compared server-side.
function withAuth(inner: typeof handler) {
  return async (req: Request) => {
    const expected = process.env.MCP_AUTH_TOKEN;
    if (expected) {
      const got = req.headers.get("authorization");
      if (got !== `Bearer ${expected}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    return inner(req);
  };
}

const authedHandler = withAuth(handler);

export { authedHandler as GET, authedHandler as POST, authedHandler as DELETE };
