import type { DiagnosisResult } from "@/lib/diagnosis";
import type { DiagnosisAnswer } from "@/lib/diagnosis";

export const RESULT_STORAGE_KEY = "keisan-eye-first-move-trainer:result";
export const DRAFT_STORAGE_KEY = "keisan-eye-first-move-trainer:draft";
export const STORAGE_CHANGE_EVENT = "keisan-eye-first-move-trainer:storage-change";

export type DiagnosisDraft = {
  currentIndex: number;
  answers: DiagnosisAnswer[];
  selectedChoiceId: string | null;
  savedAt: string;
};

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isDiagnosisAnswer(value: unknown): value is DiagnosisAnswer {
  return (
    isRecord(value) &&
    typeof value.problemId === "string" &&
    typeof value.choiceId === "string"
  );
}

function isChoiceQuality(
  value: unknown
): value is DiagnosisResult["answerDetails"][number]["quality"] {
  return (
    value === "beautiful" ||
    value === "valid_but_heavy" ||
    value === "trap" ||
    value === "wrong"
  );
}

function isDiagnosisScores(value: unknown): value is DiagnosisResult["scores"] {
  return (
    isRecord(value) &&
    typeof value.vision === "number" &&
    typeof value.beauty === "number" &&
    typeof value.trapAvoidance === "number" &&
    typeof value.structure === "number"
  );
}

function isAnswerDetail(
  value: unknown
): value is DiagnosisResult["answerDetails"][number] {
  return (
    isRecord(value) &&
    typeof value.problemId === "string" &&
    typeof value.problemTitle === "string" &&
    typeof value.choiceLabel === "string" &&
    isChoiceQuality(value.quality) &&
    typeof value.diagnosisType === "string" &&
    typeof value.isCorrect === "boolean" &&
    typeof value.comment === "string"
  );
}

function notifyStorageChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
}

export function parseDiagnosisDraft(raw: string | null): DiagnosisDraft | null {
  if (!raw) {
    return null;
  }

  try {
    const draft: unknown = JSON.parse(raw);

    if (
      !isRecord(draft) ||
      typeof draft.currentIndex !== "number" ||
      !Array.isArray(draft.answers) ||
      !draft.answers.every(isDiagnosisAnswer) ||
      !(
        typeof draft.selectedChoiceId === "string" ||
        draft.selectedChoiceId === null
      ) ||
      typeof draft.savedAt !== "string"
    ) {
      return null;
    }

    return draft as DiagnosisDraft;
  } catch {
    return null;
  }
}

export function parseDiagnosisResult(raw: string | null): DiagnosisResult | null {
  if (!raw) {
    return null;
  }

  try {
    const result: unknown = JSON.parse(raw);

    if (
      !isRecord(result) ||
      typeof result.completedAt !== "string" ||
      !isDiagnosisScores(result.scores) ||
      typeof result.type !== "string" ||
      !isStringArray(result.strengths) ||
      !isStringArray(result.weaknesses) ||
      !isStringArray(result.nextFocus) ||
      !Array.isArray(result.answerDetails) ||
      !result.answerDetails.every(isAnswerDetail)
    ) {
      return null;
    }

    return result as DiagnosisResult;
  } catch {
    return null;
  }
}

export function saveDiagnosisResult(result: DiagnosisResult) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
  notifyStorageChange();
}

export function loadDiagnosisResult(): DiagnosisResult | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(RESULT_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  const result = parseDiagnosisResult(raw);

  if (!result) {
    window.localStorage.removeItem(RESULT_STORAGE_KEY);
    notifyStorageChange();
    return null;
  }

  return result;
}

export function clearDiagnosisResult() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(RESULT_STORAGE_KEY);
  notifyStorageChange();
}

export function saveDiagnosisDraft(draft: DiagnosisDraft) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  notifyStorageChange();
}

export function loadDiagnosisDraft(): DiagnosisDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  const draft = parseDiagnosisDraft(raw);

  if (!draft) {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    notifyStorageChange();
    return null;
  }

  return draft;
}

export function clearDiagnosisDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  notifyStorageChange();
}
