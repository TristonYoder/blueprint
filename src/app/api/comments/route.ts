import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createComment } from "@/lib/db/queries";
import type { CardKind } from "@/types/blueprint";

export async function POST(req: Request) {
  const body = await req.json();
  const { cardKind, cardId, body: text } = body as { cardKind: CardKind; cardId: string; body: string };

  if (!cardId || !text?.trim() || (cardKind !== "redline" && cardKind !== "win")) {
    return NextResponse.json({ error: "Invalid comment payload" }, { status: 400 });
  }

  const comment = await createComment({
    id: `cm-${randomUUID()}`,
    cardKind,
    cardId,
    body: text.trim(),
  });

  return NextResponse.json(comment);
}
