'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { listCampaigns } from '@/lib/factory';
import { getSummary } from '@/lib/campaign';
import { getAllMetadata, type CampaignMeta, CATEGORIES } from '@/lib/metadata';
import { getProofData } from '@/lib/proof';
import { HIDDEN_CAMPAIGNS } from '@/lib/config';
import { stroopsToXlm } from '@/lib/format';
import MiniBars from '@/components/MiniBars';
import { useI18n } from '@/i18n/I18nProvider';

type Row = { address: string; raised: bigint; goal: bigint; meta?: CampaignMeta };

function Dashboard() {
  const { t } = useI18n();
  const params = useSearchParams();
  const requiredKey = process.env.NEXT_PUBLIC_STATS_KEY;
  const [unlocked, setUnlocked] = useState(!requiredKey);
  const [keyInput, setKeyInput] = useState('');

  const [rows, setRows] = useState<Row[]>([]);
  const [proof, setProof] = useState({ uniqueBackers: 0, totalContributions: 0, totalVolume: 0n });
  const [analytics, setAnalytics] = useState<{
    funnel: { visits: number; connects: number; contributeIntents: number; shares: number };
    cohorts: { week: string; wallets: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requiredKey) {
      const fromUrl = params.get('key');
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('sf.statsKey') : null;
      if (fromUrl === requiredKey || saved === requiredKey) {
        if (fromUrl === requiredKey) localStorage.setItem('sf.statsKey', requiredKey);
        setUnlocked(true);
      }
    }
  }, [params, requiredKey]);

  useEffect(() => {
    if (!unlocked) return;
    let active = true;
    (async () => {
      try {
        const [addrsRaw, meta, p] = await Promise.all([listCampaigns(), getAllMetadata(), getProofData()]);
        const addrs = addrsRaw.filter((a) => !HIDDEN_CAMPAIGNS.has(a));
        const summaries = await Promise.all(
          addrs.map(async (a) => {
            try {
              const s = await getSummary(a);
              return { address: a, raised: s.raised, goal: s.goal, meta: meta[a] } as Row;
            } catch {
              return null;
            }
          }),
        );
        if (!active) return;
        setRows(summaries.filter((r): r is Row => r !== null));
        setProof({ uniqueBackers: p.uniqueBackers, totalContributions: p.totalContributions, totalVolume: p.totalVolume });
        try {
          const res = await fetch('/api/analytics');
          if (res.ok) setAnalytics(await res.json());
        } catch {
          /* analytics optional */
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [unlocked]);

  if (!unlocked) {
    return (
      <div className="glass mx-auto mt-10 flex max-w-sm flex-col gap-2 rounded-xl border border-white/10 p-5">
        <p className="text-sm">{t('st.private')}</p>
        <input
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          type="password"
          className="rounded-lg border border-white/10 bg-transparent px-3 py-2"
        />
        <button
          onClick={() => {
            if (keyInput === requiredKey) {
              localStorage.setItem('sf.statsKey', keyInput);
              setUnlocked(true);
            }
          }}
          className="rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-2 text-sm font-medium text-white"
        >
          {t('st.unlock')}
        </button>
      </div>
    );
  }

  const totalRaised = rows.reduce<bigint>((a, r) => a + r.raised, 0n);
  const byCategory = CATEGORIES.map((c) => ({
    category: c,
    count: rows.filter((r) => r.meta?.category === c).length,
  }));
  const maxCat = Math.max(1, ...byCategory.map((b) => b.count));
  const topCampaigns = [...rows].sort((a, b) => Number(b.raised - a.raised)).slice(0, 6);

  const stats = [
    [t('st.campaigns'), String(rows.length)],
    [t('st.backers'), String(proof.uniqueBackers)],
    [t('st.contributions'), String(proof.totalContributions)],
    [t('st.volume'), stroopsToXlm(proof.totalVolume)],
    [t('st.totalRaised'), stroopsToXlm(totalRaised)],
  ];

  return (
    <div className="flex flex-col gap-5">
      {loading && <p className="text-sm opacity-60">{t('st.reading')}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label} className="glass rounded-xl border border-white/10 p-4 text-center">
            <div className="text-xl font-bold text-gradient">{value}</div>
            <div className="text-xs opacity-60">{label}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl border border-white/10 p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-70">
          {t('st.byCategory')}
        </h3>
        <div className="flex flex-col gap-2">
          {byCategory.map((b) => (
            <div key={b.category} className="flex items-center gap-3 text-sm">
              <span className="w-24 shrink-0 opacity-80">{b.category}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-fuchsia-500"
                  style={{ width: `${(b.count / maxCat) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right opacity-70">{b.count}</span>
            </div>
          ))}
        </div>
      </div>

      {analytics && (
        <div className="glass rounded-xl border border-white/10 p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-70">
            {t('st.funnel')}
          </h3>
          <div className="flex flex-col gap-2 text-sm">
            {([
              [t('st.fVisits'), analytics.funnel.visits],
              [t('st.fConnects'), analytics.funnel.connects],
              [t('st.fIntents'), analytics.funnel.contributeIntents],
              [t('st.fShares'), analytics.funnel.shares],
            ] as const).map(([label, n]) => {
              const max = Math.max(1, analytics.funnel.visits);
              return (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 opacity-80">{label}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full bg-gradient-to-r from-indigo-400 to-fuchsia-500" style={{ width: `${(n / max) * 100}%` }} />
                  </div>
                  <span className="w-10 text-right opacity-70">{n}</span>
                </div>
              );
            })}
          </div>
          {analytics.cohorts.length > 0 && (
            <div className="mt-4">
              <MiniBars
                label={t('st.weekly')}
                data={analytics.cohorts.map((c) => ({ label: c.week.slice(5), value: c.wallets }))}
              />
            </div>
          )}
        </div>
      )}

      <div className="glass rounded-xl border border-white/10 p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-70">
          {t('st.topCampaigns')}
        </h3>
        <div className="flex flex-col gap-2">
          {topCampaigns.map((r) => (
            <div key={r.address} className="flex items-center justify-between text-sm">
              <span className="truncate">{r.meta?.title ?? r.address.slice(0, 10) + '…'}</span>
              <span className="font-mono opacity-80">
                {stroopsToXlm(r.raised)} / {stroopsToXlm(r.goal)} XLM
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StatsPage() {
  const { t } = useI18n();
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-col gap-1">
        <Link href="/" className="text-xs text-indigo-300 underline">
          {t('back')}
        </Link>
        <h1 className="text-2xl font-bold text-gradient">{t('st.title')}</h1>
        <p className="text-sm opacity-70">{t('st.subtitle')}</p>
      </header>
      <Suspense fallback={<p className="text-sm opacity-60">{t('st.loading')}</p>}>
        <Dashboard />
      </Suspense>
    </main>
  );
}
