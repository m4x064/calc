"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Eye, Home, RotateCcw } from "lucide-react";
import { MathExpression } from "@/components/MathExpression";
import { RouteSteps } from "@/components/RouteSteps";
import {
  choiceDisplayIds,
  domainLabels,
  getBeautifulRouteSteps,
  getChoiceDisplayLabel,
  getProblemDisplayExpression,
  problems,
  type ChoiceQuality
} from "@/data/problems";
import { calculateDiagnosis, type DiagnosisAnswer } from "@/lib/diagnosis";
import {
  clearDiagnosisDraft,
  loadDiagnosisDraft,
  saveDiagnosisDraft,
  saveDiagnosisResult
} from "@/lib/storage";

const qualityLabel: Record<ChoiceQuality, string> = {
  beautiful: "美しい初手",
  valid_but_heavy: "正しいが重い",
  trap: "罠に近い",
  wrong: "危険"
};

const qualityClass: Record<ChoiceQuality, string> = {
  beautiful: "border-signal bg-mint",
  valid_but_heavy: "border-brass bg-white",
  trap: "border-coral bg-white",
  wrong: "border-coral bg-white"
};

const threeChoiceOrders = [
  [0, 1, 2],
  [1, 2, 0],
  [2, 0, 1],
  [1, 0, 2],
  [2, 1, 0],
  [0, 2, 1]
] as const;

function getChoiceOrder(choiceCount: number, problemIndex: number) {
  if (choiceCount === 3) {
    return threeChoiceOrders[problemIndex % threeChoiceOrders.length];
  }

  const indexes = Array.from({ length: choiceCount }, (_, index) => index);

  if (choiceCount <= 1) {
    return indexes;
  }

  const rotation = problemIndex % choiceCount;
  const rotated = [...indexes.slice(rotation), ...indexes.slice(0, rotation)];

  if (Math.floor(problemIndex / choiceCount) % 2 === 0) {
    return rotated;
  }

  const [firstChoiceIndex, ...restChoiceIndexes] = rotated;
  return [firstChoiceIndex, ...restChoiceIndexes.reverse()];
}

export default function DiagnosisPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<DiagnosisAnswer[]>([]);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const currentProblem = problems[currentIndex];
  const selectedChoice = useMemo(
    () =>
      currentProblem.choices.find((choice) => choice.id === selectedChoiceId) ??
      null,
    [currentProblem, selectedChoiceId]
  );
  const routeSteps = useMemo(
    () => getBeautifulRouteSteps(currentProblem),
    [currentProblem]
  );
  const problemExpression = useMemo(
    () => getProblemDisplayExpression(currentProblem),
    [currentProblem]
  );
  const presentedChoices = useMemo(() => {
    const order = getChoiceOrder(currentProblem.choices.length, currentIndex);

    return order.map((choiceIndex, displayIndex) => ({
      choice: currentProblem.choices[choiceIndex],
      displayId: choiceDisplayIds[displayIndex]
    }));
  }, [currentIndex, currentProblem]);
  const progress = Math.round(((currentIndex + 1) / problems.length) * 100);
  const hasProgress =
    currentIndex > 0 || answers.length > 0 || selectedChoiceId !== null;

  const saveDraftSnapshot = useCallback(() => {
    if (!isReady) {
      return;
    }

    saveDiagnosisDraft({
      currentIndex,
      answers,
      selectedChoiceId,
      savedAt: new Date().toISOString()
    });
  }, [answers, currentIndex, isReady, selectedChoiceId]);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      const draft = loadDiagnosisDraft();

      if (draft) {
        setCurrentIndex(
          Math.min(Math.max(draft.currentIndex, 0), problems.length - 1)
        );
        setAnswers(draft.answers);
        setSelectedChoiceId(draft.selectedChoiceId);
      }

      setIsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !hasProgress) {
      return;
    }

    saveDraftSnapshot();
  }, [hasProgress, isReady, saveDraftSnapshot]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      saveDraftSnapshot();
      router.push("/");
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, saveDraftSnapshot]);

  function restart() {
    clearDiagnosisDraft();
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedChoiceId(null);
  }

  function pauseToTitle() {
    saveDraftSnapshot();
    router.push("/");
  }

  function goNext() {
    if (!selectedChoice) {
      return;
    }

    const nextAnswers = [
      ...answers,
      { problemId: currentProblem.id, choiceId: selectedChoice.id }
    ];

    if (currentIndex === problems.length - 1) {
      const result = calculateDiagnosis(nextAnswers);
      saveDiagnosisResult(result);
      clearDiagnosisDraft();
      router.push("/result");
      return;
    }

    setAnswers(nextAnswers);
    setCurrentIndex((value) => value + 1);
    setSelectedChoiceId(null);
  }

  if (!isReady) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-lg border border-ink/10 bg-white/78 p-6 shadow-soft">
          <p className="text-sm font-black text-signal">Loading</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-ink">
            診断を読み込み中
          </h1>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-signal">
            Question {currentIndex + 1} / {problems.length}
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-normal text-ink">
            最初の一手を選ぶ
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={pauseToTitle}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-ink/15 bg-white/72 px-3 text-sm font-black text-ink transition hover:bg-mint"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            中断してタイトルへ
          </button>
          <button
            type="button"
            onClick={restart}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-ink/15 bg-white/72 px-3 text-sm font-black text-ink transition hover:bg-coral"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            最初から
          </button>
        </div>
      </div>

      <div className="mb-5 h-3 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-signal transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <article className="mb-4 min-w-0 rounded-lg border border-ink/10 bg-white/78 p-4 shadow-soft">
        <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-ink/58">
          <span className="rounded-full bg-paper px-3 py-1">
            Level {currentProblem.level}
          </span>
          <span className="rounded-full bg-paper px-3 py-1">
            {domainLabels[currentProblem.domain]}
          </span>
          <span className="rounded-full bg-paper px-3 py-1">
            {currentProblem.id}
          </span>
        </div>
        <p className="mt-3 text-base font-black leading-7 text-ink">
          {currentProblem.prompt}
        </p>
        <MathExpression
          expression={problemExpression}
          block
          className="problem-math mt-3 rounded-lg bg-paper px-4 py-3 text-center"
        />
        <p className="mt-3 text-sm leading-7 text-ink/65">
          Goal: {currentProblem.goal}
        </p>
        {selectedChoice ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {currentProblem.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-mint px-3 py-1 text-xs font-black text-ink/70"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </article>

      <section
        className={
          selectedChoice
            ? "grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]"
            : "w-full"
        }
      >
        {selectedChoice ? (
          <div className="min-w-0">
            <article
              className={`rounded-lg border-2 p-5 shadow-soft ${qualityClass[selectedChoice.quality]}`}
            >
              <p className="inline-flex items-center gap-2 text-sm font-black text-ink">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                {qualityLabel[selectedChoice.quality]}
              </p>
              <div className="mt-4 rounded-lg bg-paper px-4 py-3">
                <h2 className="text-2xl font-black leading-9 tracking-normal text-ink">
                  {currentProblem.title}
                </h2>
              </div>
              <p className="mt-3 text-base leading-8 text-ink/76">
                {selectedChoice.comment}
              </p>
              <p className="mt-3 rounded-lg bg-paper px-3 py-2 text-sm font-bold text-ink/70">
                作問者の意図：{currentProblem.authorIntent}
              </p>
            </article>
          </div>
        ) : null}

        <div className={`min-w-0 ${selectedChoice ? "space-y-5" : ""}`}>
          <div className={selectedChoice ? "space-y-3" : "grid gap-3 md:grid-cols-2"}>
            {presentedChoices.map(({ choice, displayId }) => {
              const isSelected = choice.id === selectedChoiceId;

              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => setSelectedChoiceId(choice.id)}
                  className={`w-full rounded-lg border p-3 text-left shadow-soft transition hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-ink bg-mint"
                      : "border-ink/10 bg-white/78 hover:border-signal"
                  }`}
                >
                  <span className="mb-1.5 inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1 text-xs font-black text-ink/64">
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    {displayId}. 最初の一手
                  </span>
                  <span className="block text-base font-black leading-7 text-ink">
                    {getChoiceDisplayLabel(currentProblem.id, choice)}
                  </span>
                  {selectedChoiceId === choice.id ? (
                    <span className="mt-3 inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-black text-ink/60">
                      {choice.diagnosisType}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {selectedChoice ? (
            <div className="space-y-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-black text-paper shadow-soft transition hover:-translate-y-0.5"
                >
                  {currentIndex === problems.length - 1
                    ? "結果を見る"
                    : "次の問題へ"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <section>
                <div className="mb-3">
                  <p className="text-sm font-black text-signal">
                    Beautiful Route
                  </p>
                  <h2 className="text-2xl font-black tracking-normal text-ink">
                    美しい変形ルート
                  </h2>
                </div>
                <RouteSteps steps={routeSteps} />
              </section>

              {selectedChoice.quality !== "beautiful" ? (
                <section className="rounded-lg border border-brass/40 bg-white/72 p-5 shadow-soft">
                  <p className="text-sm font-black text-brass">Heavy Route</p>
                  <h3 className="mt-1 text-xl font-black text-ink">
                    重くなりやすい道
                  </h3>
                  <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-ink/70">
                    {currentProblem.heavyRoute.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </section>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
