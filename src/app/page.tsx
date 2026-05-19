import Link from "next/link";
import { Eye, Route, Sparkles } from "lucide-react";
import { HomeActions } from "@/components/HomeActions";
import { problems } from "@/data/problems";

const principles = [
  "答えを入力しない。最初にどこを見るかを選ぶ。",
  "問題数ではなく、視点、罠、美しい初手を増やす。",
  "正解だけでなく、なぜその一手が軽いのかを残す。"
];

export default function Home() {
  return (
    <main>
      <section className="border-b border-ink/10">
        <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-6xl content-center gap-10 px-4 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-mint px-3 py-1 text-sm font-black text-ink">
              <Eye className="h-4 w-4" aria-hidden="true" />
              First Move Trainer
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-normal text-ink sm:text-5xl lg:text-6xl">
              計算の眼 Web
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-black leading-9 text-ink">
              計算が速い人は、手を動かす前に見る場所が違う。
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-ink/72">
              普通の教材は解き方を教える。計算の眼は、解く前にどこを見るかを教える。
              {problems.length}
              問の初手診断で、あなたの数学的視界を読み取ります。
            </p>

            <HomeActions />
          </div>

          <div className="grid content-center gap-4">
            {principles.map((item, index) => (
              <article
                key={item}
                className="rounded-lg border border-ink/10 bg-white/76 p-5 shadow-soft"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-coral text-sm font-black text-ink">
                    {index + 1}
                  </span>
                  <p className="text-lg font-black leading-8 text-ink">{item}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14" id="concept">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-coral px-3 py-1 text-sm font-black text-ink">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              この教材の考え方
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-normal text-ink">
              問題を増やすな。視点を増やせ。
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-ink/74">
            <p>
              このMVPは、答えを採点するアプリではありません。選択肢はすべて「最初の一手」です。
              同じ問題でも、展開する人、塊を見る人、罠を踏む人で、見えている景色は違います。
            </p>
            <p>
              {problems.length}
              問を解くというより、{problems.length}
              の視界を試します。選択後にはコメントと変形ルートを表示し、
              美しさとコストを見ながら、自分の数学的な癖を確認できます。
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
          {[
            ["Vision", "どこを見るか"],
            ["Beauty", "どれだけ軽い一手か"],
            ["Trap", "作問者の誘導を避ける力"]
          ].map(([label, text]) => (
            <div key={label} className="rounded-lg border border-paper/15 p-5">
              <p className="text-sm font-black text-coral">{label}</p>
              <p className="mt-2 text-xl font-black">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 sm:flex-row">
        <Link
          href="/diagnosis"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-signal px-5 text-sm font-black text-white shadow-soft"
        >
          <Route className="h-4 w-4" aria-hidden="true" />
          診断へ
        </Link>
        <Link
          href="/trial"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-ink/15 bg-white/72 px-5 text-sm font-black text-ink"
        >
          展開マンを裁く
        </Link>
      </section>
    </main>
  );
}
