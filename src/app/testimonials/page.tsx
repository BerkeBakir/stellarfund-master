'use client';
import Link from 'next/link';
import { TESTIMONIALS } from '@/lib/trust';
import { feedbackFormUrl } from '@/lib/config';
import { useI18n } from '@/i18n/I18nProvider';

export default function TestimonialsPage() {
  const { t, locale } = useI18n();
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-col gap-1">
        <Link href="/" className="text-xs text-indigo-300 underline">{t('back')}</Link>
        <h1 className="text-2xl font-bold text-gradient">{t('tm.title')}</h1>
        <p className="text-sm opacity-70">{t('tm.subtitle')}</p>
      </header>

      {TESTIMONIALS.length === 0 ? (
        <div className="glass rounded-xl border border-white/10 p-5 text-sm opacity-70">
          <p>{t('tm.empty')}{' '}
            <a className="text-indigo-300 underline" href={feedbackFormUrl(locale)} target="_blank" rel="noopener noreferrer">{t('tm.shareCta')}</a> {t('tm.viaForm')}</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {TESTIMONIALS.map((tm) => (
            <li key={tm.name + tm.quote} className="glass rounded-xl border border-white/10 p-5">
              <p className="text-sm">“{tm.quote}”</p>
              <div className="mt-2 text-xs opacity-60">— {tm.name}{tm.rating ? ` · ${'★'.repeat(tm.rating)}` : ''}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
