import { problems } from "@/data/problems";

export type TransformCard = {
  id: string;
  name: string;
  tagline: string;
  useWhen: string;
  warning: string;
  example: string;
};

const cardCopy: Record<
  string,
  {
    tagline: string;
    useWhen: string;
    warning: string;
  }
> = {
  "塊を見る": {
    tagline: "同じ形を、同じものとして扱う。",
    useWhen: "同じ式や似た式がくり返し出ているとき。",
    warning: "細かく展開すると、見えていた構造が消えます。"
  },
  "置換する": {
    tagline: "長いものに短い名前をつける。",
    useWhen: "式の主役が x そのものではないとき。",
    warning: "置換したら、最後に戻す場所を忘れない。"
  },
  "作問者の罠を見る": {
    tagline: "その計算、やらせたいだけではないか疑う。",
    useWhen: "展開すればできるが、式が急に重くなるとき。",
    warning: "面倒な道が見えたら、逆に美しい道のサインです。"
  },
  "平方完成": {
    tagline: "二次式の地形を見る。",
    useWhen: "頂点、最大最小、完全平方式を見たいとき。",
    warning: "因数分解だけに固執すると遠回りです。"
  },
  "等号成立を見る": {
    tagline: "いつぴったりになるかを先に見る。",
    useWhen: "不等式、最大最小、評価問題で使います。",
    warning: "値だけ追うと、成立条件が抜けます。"
  },
  "対称性を見る": {
    tagline: "入れ替えても変わらない形を見る。",
    useWhen: "和と積、二乗和、三角比の和などが出るとき。",
    warning: "個別値を先に求めると問題の意図がぼやけます。"
  },
  "差分を見る": {
    tagline: "数そのものではなく、増え方を見る。",
    useWhen: "数列、漸化式、変化の規則を探すとき。",
    warning: "最初の差だけで決めると罠に入ります。"
  },
  "共役化": {
    tagline: "根号の差を、平方の差へ変える。",
    useWhen: "分母に sqrt(a)-b や sqrt(a)+b があるとき。",
    warning: "分母だけ操作すると式の値が変わります。"
  },
  "和と積で見る": {
    tagline: "個別に求めず、まとまりで処理する。",
    useWhen: "x+y と xy、sin+cos などが与えられたとき。",
    warning: "和と積を混ぜる前に、関係式を作ります。"
  },
  "余事象を見る": {
    tagline: "少なくとも、を反対側から見る。",
    useWhen: "直接数えると重複が出やすい確率で使います。",
    warning: "引く対象の全体を確認してから使います。"
  }
};

function toCardId(name: string) {
  return Array.from(name)
    .map((char) => char.charCodeAt(0).toString(36))
    .join("-");
}

function fallbackCopy(name: string) {
  return {
    tagline: `${name}という視点を、次の問題でも使えるカードにする。`,
    useWhen: "同じ構造が見えたときに、最初の一手として使います。",
    warning: "カード名だけで処理せず、問題の目的地と条件を確認します。"
  };
}

const uniqueCardNames = Array.from(
  new Set(problems.flatMap((problem) => problem.cards))
);

export const transformCards: TransformCard[] = uniqueCardNames.map((name) => {
  const sourceProblem = problems.find((problem) => problem.cards.includes(name));
  const copy = cardCopy[name] ?? fallbackCopy(name);

  return {
    id: toCardId(name),
    name,
    tagline: copy.tagline,
    useWhen: copy.useWhen,
    warning: copy.warning,
    example: sourceProblem?.expression ?? name
  };
});
