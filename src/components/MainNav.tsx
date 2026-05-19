import Link from "next/link";
import { BookOpenCheck, Library, Scale, Sparkles } from "lucide-react";

const navItems = [
  { href: "/diagnosis", label: "診断", icon: BookOpenCheck },
  { href: "/cards", label: "カード", icon: Library },
  { href: "/trial", label: "裁判", icon: Scale }
];

export function MainNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/88 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-paper">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-black tracking-normal">
              計算の眼 Web
            </span>
            <span className="block truncate text-xs text-ink/58">
              First Move Trainer
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-bold text-ink/72 transition hover:bg-ink hover:text-paper"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
