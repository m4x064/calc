type ScoreBarProps = {
  label: string;
  value: number;
  tone?: "signal" | "brass" | "coral" | "plum";
};

const toneClass = {
  signal: "bg-signal",
  brass: "bg-brass",
  coral: "bg-coral",
  plum: "bg-plum"
};

export function ScoreBar({ label, value, tone = "signal" }: ScoreBarProps) {
  const normalized = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className="rounded-lg border border-ink/10 bg-white/76 p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-black text-ink">{label}</span>
        <span className="text-lg font-black tabular-nums text-ink">
          {normalized}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-ink/10">
        <div
          className={`h-full rounded-full ${toneClass[tone]}`}
          style={{ width: `${normalized}%` }}
        />
      </div>
    </div>
  );
}
