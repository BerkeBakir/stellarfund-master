'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProofData } from '@/lib/proof';
import { stroopsToXlm } from '@/lib/format';
import { SOCIAL, followerGrowth } from '@/lib/growthReport';
import MiniBars from '@/components/MiniBars';
import { useI18n } from '@/i18n/I18nProvider';
import type { Funnel } from '@/lib/retention';

type Analytics = {
  totalEvents: number;
  funnel: Funnel;
  newWalletsThisWeek: number;
  cohorts: { week: string; wallets: number }[];
};

function Tile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="glass rounded-xl border border-white/10 p-4 text-center">
      <div className="text-2xl font-bold text-gradient">{value}</div>
      <div className="text-xs opacity-60">{label}</div>
      {note && <div className="mt-0.5 text-[10px] uppercase tracking-wide opacity-40">{note}</div>}
    </div>
  );
}

export default function MetricsPage() {
  const { t } = useI18n();
  const [proof, setProof] = useState({ uniqueBackers: 0, totalContributions: 0, totalVolume: 0n });
  const [a, setA] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [p, res] = await Promise.all([
          getProofData().catch(() => null),
          fetch('/api/analytics').then((r) => r.json()).catch(() => null),
        ]);
        if (!active) return;
        if (p) setProof({ uniqueBackers: p.uniqueBackers, totalContributions: p.totalContributions, totalVolume: p.totalVolume });
        if (res) setA(res);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const f = a?.funnel;
  const conv = f && f.visits > 0 ? Math.round((f.contributeIntents / f.visits) * 100) : 0;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-col gap-1">
        <Link href="/" className="text-xs text-indigo-300 underline">{t('back')}</Link>
        <h1 className="text-2xl font-bold text-gradient">{t('metrics.title')}</h1>
        <p className="text-sm opacity-70">{t('metrics.subtitle')}</p>
      </header>

      {loading && <p className="text-sm opacity-60">{t('metrics.loading')}</p>}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label={t('metrics.uniqueBackers')} value={String(proof.uniqueBackers)} note={t('metrics.onchain')} />
        <Tile label={t('metrics.contributions')} value={String(proof.totalContributions)} note={t('metrics.onchain')} />
        <Tile label={t('metrics.volume')} value={stroopsToXlm(proof.totalVolume)} note={t('metrics.onchain')} />
        <Tile label={t('metrics.newWallets')} value={String(a?.newWalletsThisWeek ?? 0)} note={t('metrics.analytics')} />
      </section>

      <section className="glass rounded-xl border border-white/10 p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-70">{t('metrics.funnel')}</h3>
        <div className="flex flex-col gap-2 text-sm">
          {[
            [t('metrics.visits'), f?.visits ?? 0],
            [t('metrics.connects'), f?.connects ?? 0],
            [t('metrics.intents'), f?.contributeIntents ?? 0],
            [t('metrics.shares'), f?.shares ?? 0],
          ].map(([label, n]) => {
            const max = Math.max(1, f?.visits ?? 1);
            return (
              <div key={label as string} className="flex items-center gap-3">
                <span className="w-32 shrink-0 opacity-80">{label}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full bg-gradient-to-r from-indigo-400 to-fuchsia-500" style={{ width: `${(Number(n) / max) * 100}%` }} />
                </div>
                <span className="w-10 text-right opacity-70">{Number(n)}</span>
              </div>
            );
          })}
          <p className="mt-1 text-xs opacity-60">{t('metrics.conversion')}: {conv}%</p>
        </div>
      </section>

      <section className="glass rounded-xl border border-white/10 p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-70">{t('metrics.weekly')}</h3>
        <MiniBars data={(a?.cohorts ?? []).map((c) => ({ label: c.week.slice(5), value: c.wallets }))} />
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label={t('metrics.followers')} value={String(SOCIAL.followers)} note={t('metrics.selfReported')} />
        <Tile label={t('metrics.gained')} value={`+${followerGrowth()}`} note={t('metrics.selfReported')} />
        <Tile label={t('metrics.posts')} value={String(SOCIAL.updatePosts)} note={t('metrics.selfReported')} />
        <Tile label={t('metrics.community')} value={String(SOCIAL.communityContributions)} note={t('metrics.selfReported')} />
      </section>

      <p className="text-xs opacity-50">
        <Link href="/growth" className="underline">{t('metrics.seeReport')}</Link>
      </p>
    </main>
  );
}
