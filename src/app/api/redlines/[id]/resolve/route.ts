import { NextResponse } from "next/server";
import { removeRedline } from "@/lib/db/queries";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await removeRedline(id);
  return NextResponse.json({ ok: true });
}
