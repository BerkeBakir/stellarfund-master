import Link from 'next/link';
import { sortedChangelog, type ChangeStatus } from '@/lib/changelog';

export const metadata = {
  title: 'Changelog — StellarFund',
  description: 'Product updates and roadmap for StellarFund.',
};

const badge: Record<ChangeStatus, string> = {
  shipped: 'bg-emerald-500/20 text-emerald-300',
  'in-progress': 'bg-amber-500/20 text-amber-300',
  planned: 'bg-white/10 text-white/60',
};

export default function ChangelogPage() {
  const entries = sortedChangelog();
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-col gap-1">
        <Link href="/" className="text-xs text-indigo-300 underline">← back</Link>
        <h1 className="text-2xl font-bold text-gradient">Changelog &amp; roadmap</h1>
        <p className="text-sm opacity-70">What we shipped, what&apos;s in progress, and what&apos;s next.</p>
      </header>

      <ol className="flex flex-col gap-4">
        {entries.map((e, i) => (
          <li key={`${e.date}-${i}`} className="glass rounded-xl border border-white/10 p-5">
            <div className="mb-2 flex items-center gap-3">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badge[e.status]}`}>
                {e.status}
              </span>
              <span className="text-xs opacity-50">{e.date}</span>
            </div>
            <h2 className="mb-1 font-semibold">{e.title}</h2>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm opacity-90">
              {e.items.map((it) => <li key={it}>{it}</li>)}
            </ul>
          </li>
        ))}
      </ol>
    </main>
  );
}
