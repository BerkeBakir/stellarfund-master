import Link from 'next/link';
import { TESTIMONIALS } from '@/lib/trust';

export const metadata = {
  title: 'What people say — StellarFund',
  description: 'Real feedback from StellarFund users.',
};

export default function TestimonialsPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-col gap-1">
        <Link href="/" className="text-xs text-indigo-300 underline">← back</Link>
        <h1 className="text-2xl font-bold text-gradient">What people say</h1>
        <p className="text-sm opacity-70">Real, consented feedback from our users.</p>
      </header>

      {TESTIMONIALS.length === 0 ? (
        <div className="glass rounded-xl border border-white/10 p-5 text-sm opacity-70">
          <p>We&apos;re collecting feedback now. Tried StellarFund?{' '}
            <a className="text-indigo-300 underline" href="/#campaigns">Share your experience</a> via the feedback form —
            real quotes will appear here.</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <li key={t.name + t.quote} className="glass rounded-xl border border-white/10 p-5">
              <p className="text-sm">“{t.quote}”</p>
              <div className="mt-2 text-xs opacity-60">— {t.name}{t.rating ? ` · ${'★'.repeat(t.rating)}` : ''}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
