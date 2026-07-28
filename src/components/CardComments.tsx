"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";
import type { CardKind, Comment } from "@/types/blueprint";

interface CardCommentsProps {
  cardKind: CardKind;
  cardId: string;
  comments: Comment[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Margin notes — Triston writing a correction back to the agent, not a
// discussion thread. The dot is the agent's own sign-off: dim/hollow until
// the agent calls acknowledge_comment on its next run, then it fills in
// the same green used everywhere else "seen and handled" is expressed.
export default function CardComments({ cardKind, cardId, comments: initial }: CardCommentsProps) {
  const [comments, setComments] = useState(initial);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    const body = draft.trim();
    if (!body || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardKind, cardId, body }),
      });
      if (res.ok) {
        const comment: Comment = await res.json();
        setComments((prev) => [...prev, comment]);
        setDraft("");
        setOpen(false);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border-t border-bp-line pt-3 flex flex-col gap-2">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-2 border-l border-bp-line-strong pl-2">
          <span
            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
              comment.acknowledgedAt ? "bg-bp-stamp" : "bg-bp-ink-faint"
            }`}
            title={comment.acknowledgedAt ? "Seen by the agent" : "Waiting for the agent's next run"}
          />
          <div className="flex flex-col">
            <p className="text-sm italic text-bp-ink-dim">{comment.body}</p>
            <span className="bp-label text-bp-ink-faint">
              {formatDate(comment.createdAt)}
              {comment.acknowledgedAt ? " · seen" : " · pending"}
            </span>
          </div>
        </div>
      ))}

      {open ? (
        <div className="flex flex-col gap-2">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Leave a note for the agent's next run…"
            rows={2}
            className="w-full resize-none border border-bp-line-strong bg-bp-surface-2 p-2 text-sm text-bp-ink placeholder:text-bp-ink-faint focus:outline-none"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={submit}
              disabled={submitting || !draft.trim()}
              className="bp-label text-bp-ink hover:opacity-75 transition-opacity disabled:opacity-40"
            >
              {submitting ? "Saving…" : "Save note"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setDraft("");
              }}
              className="bp-label text-bp-ink-faint hover:text-bp-ink-dim transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex w-fit items-center gap-2 bp-label text-bp-ink-faint hover:text-bp-ink-dim transition-colors"
        >
          <PenLine size={14} />
          {comments.length === 0 ? "Note" : "Add another"}
        </button>
      )}
    </div>
  );
}
