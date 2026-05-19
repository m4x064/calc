import { ArrowDown, BadgeCheck, Gauge } from "lucide-react";
import type { TransformStep } from "@/data/problems";
import { MathExpression } from "@/components/MathExpression";

type RouteStepsProps = {
  steps: TransformStep[];
};

function MiniMeter({ value, tone }: { value: number; tone: "beauty" | "cost" }) {
  const width = `${Math.min(100, Math.max(0, value * 10))}%`;
  const color = tone === "beauty" ? "bg-signal" : "bg-coral";

  return (
    <div className="h-2 overflow-hidden rounded-full bg-ink/10">
      <div className={`h-full rounded-full ${color}`} style={{ width }} />
    </div>
  );
}

export function RouteSteps({ steps }: RouteStepsProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={`${step.card}-${index}`} className="space-y-3">
          <article className="min-w-0 overflow-hidden rounded-lg border border-ink/10 bg-white/78 p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 rounded-full bg-mint px-3 py-1 text-xs font-black text-ink">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {step.card}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-ink/58">
                <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
                変形 {index + 1}
              </div>
            </div>

            {step.expressionMode === "text" ? (
              <p className="mt-4 rounded-lg bg-paper px-4 py-5 text-center text-lg font-black leading-8 text-ink">
                {step.expression}
              </p>
            ) : (
              <MathExpression
                expression={step.expression}
                block
                className="route-math mt-4 rounded-lg bg-paper px-3 py-6 text-center"
              />
            )}

            <p className="mt-4 text-sm leading-7 text-ink/72">{step.note}</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1 flex justify-between text-xs font-bold text-ink/58">
                  <span>美しさ</span>
                  <span>{step.beauty}/10</span>
                </div>
                <MiniMeter value={step.beauty} tone="beauty" />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs font-bold text-ink/58">
                  <span>コスト</span>
                  <span>{step.cost}/10</span>
                </div>
                <MiniMeter value={step.cost} tone="cost" />
              </div>
            </div>
          </article>
          {index < steps.length - 1 ? (
            <div className="flex justify-center text-ink/35">
              <ArrowDown className="h-5 w-5" aria-hidden="true" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
