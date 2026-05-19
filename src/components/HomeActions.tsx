"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { ArrowRight, BookOpenCheck, Library, RotateCcw } from "lucide-react";
import {
  clearDiagnosisDraft,
  clearDiagnosisResult,
  DRAFT_STORAGE_KEY,
  parseDiagnosisDraft,
  STORAGE_CHANGE_EVENT
} from "@/lib/storage";
import { problems } from "@/data/problems";

function subscribeToDraft(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_CHANGE_EVENT, callback);
  window.addEventListener("focus", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_CHANGE_EVENT, callback);
    window.removeEventListener("focus", callback);
  };
}

function getDraftSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(DRAFT_STORAGE_KEY);
}

function getServerDraftSnapshot() {
  return null;
}

export function HomeActions() {
  const rawDraft = useSyncExternalStore(
    subscribeToDraft,
    getDraftSnapshot,
    getServerDraftSnapshot
  );
  const draft = useMemo(() => parseDiagnosisDraft(rawDraft), [rawDraft]);
  const hasDraft =
    !!draft &&
    (draft.currentIndex > 0 ||
      draft.answers.length > 0 ||
      draft.selectedChoiceId !== null);
  const nextQuestionNumber = draft
    ? Math.min(draft.currentIndex + 1, problems.length)
    : 1;

  function startFresh() {
    clearDiagnosisDraft();
    clearDiagnosisResult();
  }

  if (hasDraft) {
    return (
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/diagnosis"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-black text-paper shadow-soft transition hover:-translate-y-0.5"
        >
          <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
          続きから再開
          <span className="rounded-full bg-paper/14 px-2 py-0.5 text-xs">
            {nextQuestionNumber}/{problems.length}
          </span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href="/diagnosis"
          onClick={startFresh}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-ink/15 bg-white/70 px-5 text-sm font-black text-ink transition hover:bg-mint"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          最初から
        </Link>
        <Link
          href="/cards"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-ink/15 bg-white/70 px-5 text-sm font-black text-ink transition hover:bg-mint"
        >
          <Library className="h-4 w-4" aria-hidden="true" />
          カード
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link
        href="/diagnosis"
        onClick={startFresh}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-black text-paper shadow-soft transition hover:-translate-y-0.5"
      >
        <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
        診断を始める
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <Link
        href="/cards"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-ink/15 bg-white/70 px-5 text-sm font-black text-ink transition hover:bg-mint"
      >
        <Library className="h-4 w-4" aria-hidden="true" />
        変形カードを見る
      </Link>
    </div>
  );
}
