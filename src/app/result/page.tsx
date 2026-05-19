"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { ArrowRight, BookOpenCheck, Library, RotateCcw } from "lucide-react";
import { ScoreBar } from "@/components/ScoreBar";
import type { DiagnosisResult } from "@/lib/diagnosis";
import {
  clearDiagnosisResult,
  parseDiagnosisResult,
  RESULT_STORAGE_KEY,
  STORAGE_CHANGE_EVENT
} from "@/lib/storage";

const qualityText: Record<DiagnosisResult["answerDetails"][number]["quality"], string> =
  {
    beautiful: "美しい",
    valid_but_heavy: "重いが有効",
    trap: "罠",
    wrong: "危険"
  };

function subscribeToResult(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_CHANGE_EVENT, callback);
  };
}

function getResultSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(RESULT_STORAGE_KEY);
}

function getServerResultSnapshot() {
  return null;
}

export default function ResultPage() {
  const rawResult = useSyncExternalStore(
    subscribeToResult,
    getResultSnapshot,
    getServerResultSnapshot
  );
  const result = useMemo(() => parseDiagnosisResult(rawResult), [rawResult]);

  function retry() {
    clearDiagnosisResult();
  }

  if (!result) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <section className="rounded-lg border border-ink/10 bg-white/78 p-6 shadow-soft">
          <p className="text-sm font-black text-coral">No Result</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-ink">
            まだ診断結果がありません
          </h1>
          <p className="mt-4 leading-8 text-ink/70">
            診断を終えると、Vision Score と診断タイプがここに保存されます。
          </p>
          <Link
            href="/diagnosis"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-lg bg-ink px-5 text-sm font-black text-paper"
          >
            <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
            診断を始める
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black text-signal">Diagnosis Result</p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-normal text-ink">
            {result.type}
          </h1>
          <p className="mt-4 text-base leading-8 text-ink/72">
            これは正誤の成績ではなく、「最初にどこを見たか」の診断です。
            計算の速さより、視界の向きが表示されています。
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/diagnosis"
              onClick={retry}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-black text-paper shadow-soft"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              もう一度診断する
            </Link>
            <Link
              href="/cards"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-ink/15 bg-white/72 px-5 text-sm font-black text-ink"
            >
              <Library className="h-4 w-4" aria-hidden="true" />
              変形カードを見る
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ScoreBar label="Vision Score" value={result.scores.vision} tone="signal" />
          <ScoreBar label="Beauty Score" value={result.scores.beauty} tone="brass" />
          <ScoreBar
            label="Trap Avoidance"
            value={result.scores.trapAvoidance}
            tone="coral"
          />
          <ScoreBar
            label="Structure Score"
            value={result.scores.structure}
            tone="plum"
          />
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-3">
        <article className="rounded-lg border border-ink/10 bg-white/76 p-5 shadow-soft">
          <h2 className="text-lg font-black text-ink">強み</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-ink/72">
            {result.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-lg border border-ink/10 bg-white/76 p-5 shadow-soft">
          <h2 className="text-lg font-black text-ink">弱点</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-ink/72">
            {result.weaknesses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-lg border border-ink/10 bg-white/76 p-5 shadow-soft">
          <h2 className="text-lg font-black text-ink">次に鍛える視点</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-ink/72">
            {result.nextFocus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <p className="text-sm font-black text-signal">Review</p>
          <h2 className="text-2xl font-black tracking-normal text-ink">
            選んだ最初の一手
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {result.answerDetails.map((answer) => (
            <article
              key={answer.problemId}
              className="rounded-lg border border-ink/10 bg-white/76 p-4 shadow-soft"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-black text-ink">{answer.problemTitle}</h3>
                <span className="rounded-full bg-paper px-3 py-1 text-xs font-black text-ink/62">
                  {answer.isCorrect ? "視点一致" : qualityText[answer.quality]}
                </span>
              </div>
              <p className="mt-3 text-sm font-bold leading-7 text-ink">
                {answer.choiceLabel}
              </p>
              <p className="mt-1 text-xs font-black text-signal">
                {answer.diagnosisType}
              </p>
              <p className="mt-2 text-sm leading-7 text-ink/62">
                {answer.comment}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
