import { Library } from "lucide-react";
import { transformCards } from "@/data/cards";

export default function CardsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-mint px-3 py-1 text-sm font-black text-ink">
          <Library className="h-4 w-4" aria-hidden="true" />
          Transform Cards
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-normal text-ink">
          変形カード図鑑
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-ink/70">
          問題を増やす前に、視点を増やすためのカードです。
          診断で出てきた初手を、次の問題でも再利用できる形にしておきます。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {transformCards.map((card) => (
          <article
            key={card.id}
            className="flex min-h-[24rem] flex-col rounded-lg border border-ink/10 bg-white/76 p-5 shadow-soft"
          >
            <p className="text-xs font-black uppercase tracking-normal text-signal">
              Card
            </p>
            <h2 className="mt-2 text-xl font-black tracking-normal text-ink">
              {card.name}
            </h2>
            <p className="mt-2 text-sm font-bold leading-7 text-ink/78">
              {card.tagline}
            </p>
            <div className="mt-4 rounded-lg bg-paper px-4 py-4">
              <p className="text-xs font-black uppercase tracking-normal text-ink/45">
                Example
              </p>
              <p className="mt-2 break-words text-base font-black leading-7 text-ink">
                {card.example}
              </p>
            </div>
            <dl className="mt-4 space-y-3 text-sm leading-7">
              <div>
                <dt className="font-black text-ink">使う場面</dt>
                <dd className="text-ink/68">{card.useWhen}</dd>
              </div>
              <div>
                <dt className="font-black text-ink">注意</dt>
                <dd className="text-ink/68">{card.warning}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </main>
  );
}
