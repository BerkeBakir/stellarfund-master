'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProofData } from '@/lib/proof';
import { stroopsToXlm } from '@/lib/format';
import { SOCIAL, followerGrowth } from '@/lib/growthReport';
import { useI18n } from '@/i18n/I18nProvider';
import type { Funnel } from '@/lib/retention';

export default function GrowthPage() {
  const { t } = useI18n();
  const [proof, setProof] = useState({ uniqueBackers: 0, totalContributions: 0, totalVolume: 0n });
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [newWeek, setNewWeek] = useState(0);

  useEffect(() => {
    (async () => {
      const [p, a] = await Promise.all([
        getProofData().catch(() => null),
        fetch('/api/analytics').then((r) => r.json()).catch(() => null),
      ]);
      if (p) setProof({ uniqueBackers: p.uniqueBackers, totalContributions: p.totalContributions, totalVolume: p.totalVolume });
      if (a) { setFunnel(a.funnel); setNewWeek(a.newWalletsThisWeek); }
    })();
  }, []);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-4 sm:p-6">
      <header className="flex flex-col gap-1">
        <Link href="/" className="text-xs text-indigo-300 underline">{t('back')}</Link>
        <h1 className="text-2xl font-bold text-gradient">{t('growth.title')}</h1>
        <p className="text-sm opacity-70">
          Period: {SOCIAL.periodStart} → {SOCIAL.periodEnd}. On-chain figures are live &amp;
          verifiable; social/community figures are self-reported.
        </p>
      </header>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">{t('growth.onchainSection')}</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li className="glass rounded-xl border border-white/10 p-4 text-center"><div className="text-xl font-bold text-gradient">{proof.uniqueBackers}</div><div className="text-xs opacity-60">Unique backers</div></li>
          <li className="glass rounded-xl border border-white/10 p-4 text-center"><div className="text-xl font-bold text-gradient">{proof.totalContributions}</div><div className="text-xs opacity-60">Contributions</div></li>
          <li className="glass rounded-xl border border-white/10 p-4 text-center"><div className="text-xl font-bold text-gradient">{stroopsToXlm(proof.totalVolume)}</div><div className="text-xs opacity-60">Volume (XLM)</div></li>
          <li className="glass rounded-xl border border-white/10 p-4 text-center"><div className="text-xl font-bold text-gradient">{funnel?.visits ?? 0}</div><div className="text-xs opacity-60">Visits</div></li>
          <li className="glass rounded-xl border border-white/10 p-4 text-center"><div className="text-xl font-bold text-gradient">{funnel?.connects ?? 0}</div><div className="text-xs opacity-60">Wallet connects</div></li>
          <li className="glass rounded-xl border border-white/10 p-4 text-center"><div className="text-xl font-bold text-gradient">{newWeek}</div><div className="text-xs opacity-60">New wallets / 7d</div></li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">{t('growth.socialSection')}</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <li className="glass rounded-xl border border-white/10 p-4 text-center"><div className="text-xl font-bold">{SOCIAL.followers}</div><div className="text-xs opacity-60">Followers</div></li>
          <li className="glass rounded-xl border border-white/10 p-4 text-center"><div className="text-xl font-bold">+{followerGrowth()}</div><div className="text-xs opacity-60">Gained</div></li>
          <li className="glass rounded-xl border border-white/10 p-4 text-center"><div className="text-xl font-bold">{SOCIAL.updatePosts}</div><div className="text-xs opacity-60">Update posts</div></li>
          <li className="glass rounded-xl border border-white/10 p-4 text-center"><div className="text-xl font-bold">{SOCIAL.communityContributions}</div><div className="text-xs opacity-60">Community</div></li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">{t('growth.highlights')}</h2>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm opacity-90">
          {SOCIAL.highlights.map((h) => <li key={h}>{h}</li>)}
        </ul>
      </section>

      {SOCIAL.socialProofUrls.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">Social proof</h2>
          <ul className="flex flex-col gap-1 text-sm">
            {SOCIAL.socialProofUrls.map((u) => <li key={u}><a className="text-indigo-300 underline" href={u} target="_blank" rel="noreferrer">{u}</a></li>)}
          </ul>
        </section>
      )}
    </main>
  );
}
