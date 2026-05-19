import Link from "next/link";
import { ArrowRight, Gavel, Scale } from "lucide-react";
import { MathExpression } from "@/components/MathExpression";
import { RouteSteps } from "@/components/RouteSteps";

const trialRoute = [
  {
    expression: "u=x+1",
    card: "塊を見る",
    cost: 1,
    beauty: 9,
    note: "裁判所は、同じ塊が二度登場している事実を確認しました。"
  },
  {
    expression: "u^2-2u-15",
    card: "置換する",
    cost: 2,
    beauty: 8,
    note: "被告が展開で肥大化させた式は、置換により小さな二次式へ戻ります。"
  },
  {
    expression: "(u-5)(u+3)",
    card: "美しい初手",
    cost: 2,
    beauty: 8,
    note: "裁判長は、計算力よりも視界の整理を重視しました。"
  }
];

export default function TrialPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <section className="rounded-lg border border-ink/10 bg-white/80 p-6 shadow-soft">
        <p className="inline-flex items-center gap-2 rounded-full bg-coral px-3 py-1 text-sm font-black text-ink">
          <Scale className="h-4 w-4" aria-hidden="true" />
          嘘解法裁判
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-normal text-ink">
          被告：展開マン
        </h1>
        <p className="mt-4 text-lg font-black leading-8 text-ink">
          罪状：塊を無視して式を肥大化させた罪
        </p>

        <div className="mt-6 rounded-lg bg-paper px-3 py-8 text-center">
          <MathExpression expression="(x+1)^2 - 2(x+1) - 15" block />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-lg border border-ink/10 bg-paper p-5">
            <h2 className="inline-flex items-center gap-2 text-lg font-black text-ink">
              <Gavel className="h-5 w-5" aria-hidden="true" />
              検察側の主張
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink/72">
              被告は、明らかに x+1 という塊が見えていたにもかかわらず、
              ただちに展開を開始。式を長くし、係数整理の手間を増やしました。
            </p>
          </article>
          <article className="rounded-lg border border-ink/10 bg-paper p-5">
            <h2 className="text-lg font-black text-ink">弁護側の主張</h2>
            <p className="mt-3 text-sm leading-7 text-ink/72">
              展開しても答えには到達できます。被告には一定の計算力があり、
              途中式を管理する能力も認められます。
            </p>
          </article>
        </div>

        <article className="mt-6 rounded-lg border-2 border-ink bg-mint p-5">
          <p className="text-sm font-black text-ink/62">判決</p>
          <p className="mt-2 text-xl font-black leading-9 text-ink">
            有罪。ただし計算力は認める。次回から置換カードを使用せよ。
          </p>
          <p className="mt-3 text-sm leading-7 text-ink/72">
            この裁判は、展開そのものを禁止するものではありません。
            先に塊を見るべき場面で展開を急いだことが、今回の問題です。
          </p>
        </article>
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <p className="text-sm font-black text-signal">Court Route</p>
          <h2 className="text-2xl font-black tracking-normal text-ink">
            模範変形ルート
          </h2>
        </div>
        <RouteSteps steps={trialRoute} />
      </section>

      <div className="mt-8 flex justify-end">
        <Link
          href="/diagnosis"
          className="inline-flex h-12 items-center gap-2 rounded-lg bg-ink px-5 text-sm font-black text-paper shadow-soft"
        >
          診断で初手を選ぶ
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
