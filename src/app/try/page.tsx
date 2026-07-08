'use client';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

// Acquisition funnel: let newcomers experience the product risk-free on testnet
// before contributing real XLM on mainnet.
export default function TryPage() {
  const { t } = useI18n();
  const steps: [string, string][] = [
    [t('try.s1t'), t('try.s1d')],
    [t('try.s2t'), t('try.s2d')],
    [t('try.s3t'), t('try.s3d')],
    [t('try.s4t'), t('try.s4d')],
  ];
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-col gap-1">
        <Link href="/" className="text-xs text-indigo-300 underline">{t('back')}</Link>
        <h1 className="text-2xl font-bold text-gradient">{t('try.title')}</h1>
        <p className="text-sm opacity-70">{t('try.subtitle')}</p>
      </header>

      <ol className="flex flex-col gap-3">
        {steps.map(([title, desc], i) => (
          <li key={title} className="glass flex gap-3 rounded-xl border border-white/10 p-4">
            <span className="text-lg font-bold text-gradient">{i + 1}</span>
            <div>
              <div className="font-medium">{title}</div>
              <div className="text-sm opacity-70">{desc}</div>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-3">
        <a href="https://stellarfund-blue.vercel.app" target="_blank" rel="noreferrer" className="rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
          {t('try.open')}
        </a>
        <Link href="/" className="rounded-lg border border-white/10 px-4 py-2 text-sm">{t('try.backMain')}</Link>
      </div>
      <p className="text-xs opacity-50">{t('try.note')}</p>
    </main>
  );
}
