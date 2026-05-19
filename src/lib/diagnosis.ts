import {
  findProblem,
  getChoiceDisplayLabel,
  problems,
  type ChoiceQuality,
  type ProblemChoice
} from "@/data/problems";

export type DiagnosisAnswer = {
  problemId: string;
  choiceId: string;
};

export type DiagnosisScores = {
  vision: number;
  beauty: number;
  trapAvoidance: number;
  structure: number;
};

export type DiagnosisType =
  | "展開依存型"
  | "置換視力型"
  | "局所計算型"
  | "罠突入型"
  | "美形探索型"
  | "構造先読み型";

export type DiagnosisResult = {
  completedAt: string;
  scores: DiagnosisScores;
  type: DiagnosisType;
  strengths: string[];
  weaknesses: string[];
  nextFocus: string[];
  answerDetails: Array<{
    problemId: string;
    problemTitle: string;
    choiceLabel: string;
    quality: ChoiceQuality;
    diagnosisType: string;
    isCorrect: boolean;
    comment: string;
  }>;
};

const baseScores: Record<ChoiceQuality, DiagnosisScores> = {
  beautiful: {
    vision: 90,
    beauty: 90,
    trapAvoidance: 88,
    structure: 90
  },
  valid_but_heavy: {
    vision: 56,
    beauty: 42,
    trapAvoidance: 62,
    structure: 50
  },
  trap: {
    vision: 34,
    beauty: 28,
    trapAvoidance: 28,
    structure: 34
  },
  wrong: {
    vision: 18,
    beauty: 16,
    trapAvoidance: 12,
    structure: 18
  }
};

const profileMap: Record<
  DiagnosisType,
  {
    strengths: string[];
    weaknesses: string[];
    nextFocus: string[];
  }
> = {
  展開依存型: {
    strengths: ["計算を最後まで押し切る粘りがある", "標準処理へ入る速度が速い"],
    weaknesses: ["構造を見る前に式を広げやすい", "重い正解ルートを選びがち"],
    nextFocus: ["展開しない", "塊を見る", "作問者の罠を見る"]
  },
  置換視力型: {
    strengths: ["式の主役に名前をつける視点がある", "高次や複雑な形を低次へ戻せる"],
    weaknesses: ["戻し忘れや条件確認で崩れることがある", "局所の符号確認が後回しになりやすい"],
    nextFocus: ["置換する", "戻す", "チェックする"]
  },
  局所計算型: {
    strengths: ["小さな計算を始める反応が速い", "具体値で様子を見る姿勢がある"],
    weaknesses: ["全体構造や作問者の意図を見る前に手が動きやすい", "目的地と初手がずれることがある"],
    nextFocus: ["目的地逆算", "対称性を見る", "差分を見る"]
  },
  罠突入型: {
    strengths: ["迷わず初手を出せる", "反応速度は高い"],
    weaknesses: ["見かけの簡単さに飛びつきやすい", "公式誤用や重複カウントに注意が必要"],
    nextFocus: ["作問者の罠を見る", "条件を見る", "式の種類を確認する"]
  },
  美形探索型: {
    strengths: ["計算量だけでなく形の美しさを見ている", "次につながる軽い一手を選べる"],
    weaknesses: ["美しい形を探しすぎると最後の確認が薄くなる", "条件チェックが後回しになることがある"],
    nextFocus: ["等号成立を見る", "平方完成", "共役化"]
  },
  構造先読み型: {
    strengths: ["作問者が置いた構造を先に読める", "問題全体の視界が広い"],
    weaknesses: ["速く見えるぶん、細部の検算が必要", "ルートの言語化を省略しがち"],
    nextFocus: ["作者意図を一言で言う", "最後の1行を検算する", "カード名で初手を記録する"]
  }
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreChoice(choice: ProblemChoice, isCorrect: boolean): DiagnosisScores {
  const base = baseScores[choice.quality];
  const bonus = isCorrect ? 4 : 0;

  return {
    vision: clampScore(base.vision + bonus),
    beauty: clampScore(base.beauty + bonus),
    trapAvoidance: clampScore(base.trapAvoidance + bonus),
    structure: clampScore(base.structure + bonus)
  };
}

function averageScores(scores: DiagnosisScores, count: number): DiagnosisScores {
  return {
    vision: Math.round(scores.vision / count),
    beauty: Math.round(scores.beauty / count),
    trapAvoidance: Math.round(scores.trapAvoidance / count),
    structure: Math.round(scores.structure / count)
  };
}

function determineType(
  scores: DiagnosisScores,
  counts: Record<ChoiceQuality, number>,
  completedCount: number
): DiagnosisType {
  const trapLike = counts.trap + counts.wrong;

  if (trapLike >= Math.ceil(completedCount * 0.34)) {
    return "罠突入型";
  }

  if (counts.valid_but_heavy >= Math.ceil(completedCount * 0.45)) {
    return "展開依存型";
  }

  if (scores.vision < 55) {
    return "局所計算型";
  }

  if (counts.beautiful >= Math.ceil(completedCount * 0.6) && scores.structure >= 82) {
    return "構造先読み型";
  }

  if (counts.beautiful >= Math.ceil(completedCount * 0.55)) {
    return "美形探索型";
  }

  if (scores.structure >= 74) {
    return "置換視力型";
  }

  return "局所計算型";
}

export function calculateDiagnosis(answers: DiagnosisAnswer[]): DiagnosisResult {
  const totals: DiagnosisScores = {
    vision: 0,
    beauty: 0,
    trapAvoidance: 0,
    structure: 0
  };
  const counts: Record<ChoiceQuality, number> = {
    beautiful: 0,
    valid_but_heavy: 0,
    trap: 0,
    wrong: 0
  };
  const answerDetails: DiagnosisResult["answerDetails"] = [];

  for (const answer of answers) {
    const problem = findProblem(answer.problemId);
    const choice = problem?.choices.find((item) => item.id === answer.choiceId);

    if (!problem || !choice) {
      continue;
    }

    const isCorrect = choice.id === problem.correctChoiceId;
    const score = scoreChoice(choice, isCorrect);

    totals.vision += score.vision;
    totals.beauty += score.beauty;
    totals.trapAvoidance += score.trapAvoidance;
    totals.structure += score.structure;
    counts[choice.quality] += 1;

    answerDetails.push({
      problemId: problem.id,
      problemTitle: problem.title,
      choiceLabel: getChoiceDisplayLabel(problem.id, choice),
      quality: choice.quality,
      diagnosisType: choice.diagnosisType,
      isCorrect,
      comment: choice.comment
    });
  }

  const completedCount = Math.max(1, answerDetails.length || problems.length);
  const scores = averageScores(totals, completedCount);
  const type = determineType(scores, counts, completedCount);
  const profile = profileMap[type];

  return {
    completedAt: new Date().toISOString(),
    scores,
    type,
    strengths: profile.strengths,
    weaknesses: profile.weaknesses,
    nextFocus: profile.nextFocus,
    answerDetails
  };
}
