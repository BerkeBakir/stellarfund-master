'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import WalletBar from '@/components/WalletBar';
import { useAppStore } from '@/store';
import { listCampaigns } from '@/lib/factory';
import { getSummary, contributionOf } from '@/lib/campaign';
import { getAllMetadata, type CampaignMeta } from '@/lib/metadata';
import { getFollows } from '@/lib/follows';
import { HIDDEN_CAMPAIGNS } from '@/lib/config';
import { stroopsToXlm } from '@/lib/format';
import { useI18n } from '@/i18n/I18nProvider';

type Row = { address: string; meta?: CampaignMeta; mine: bigint; created: boolean };

export default function MePage() {
  const { t } = useI18n();
  const publicKey = useAppStore((s) => s.publicKey);
  const [rows, setRows] = useState<Row[]>([]);
  const [followed, setFollowed] = useState<{ address: string; meta?: CampaignMeta }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const meta = await getAllMetadata();
      const follows = getFollows();
      if (active) setFollowed(follows.map((a) => ({ address: a, meta: meta[a] })));

      if (!publicKey) { setRows([]); return; }
      setLoading(true);
      try {
        const addrs = (await listCampaigns()).filter((a) => !HIDDEN_CAMPAIGNS.has(a));
        const out = await Promise.all(
          addrs.map(async (a) => {
            try {
              const [s, mine] = await Promise.all([getSummary(a), contributionOf(a, publicKey)]);
              const created = s.creator === publicKey;
              if (mine <= 0n && !created) return null;
              return { address: a, meta: meta[a], mine, created } as Row;
            } catch {
              return null;
            }
          }),
        );
        if (active) setRows(out.filter((r): r is Row => r !== null));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [publicKey]);

  const contributed = rows.filter((r) => r.mine > 0n);
  const created = rows.filter((r) => r.created);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-col gap-1">
        <Link href="/" className="text-xs text-indigo-300 underline">{t('back')}</Link>
        <h1 className="text-2xl font-bold text-gradient">{t('me.title')}</h1>
        <p className="text-sm opacity-70">{t('me.subtitle')}</p>
      </header>

      <WalletBar />
      {publicKey && loading && <p className="text-sm opacity-60">{t('me.reading')}</p>}

      {publicKey && (
        <>
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">{t('me.contributions')}</h2>
            {contributed.length === 0 ? (
              <p className="text-sm opacity-60">{t('me.noContributions')} <Link href="/" className="text-indigo-300 underline">{t('me.findCampaign')}</Link></p>
            ) : (
              <ul className="flex flex-col gap-2">
                {contributed.map((r) => (
                  <li key={r.address} className="glass flex items-center justify-between rounded-xl border border-white/10 p-3 text-sm">
                    <Link href={`/campaign/${r.address}`} className="truncate hover:underline">{r.meta?.title ?? r.address.slice(0, 10) + '…'}</Link>
                    <span className="font-mono opacity-80">{stroopsToXlm(r.mine)} XLM</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">{t('me.campaigns')}</h2>
            {created.length === 0 ? (
              <p className="text-sm opacity-60">{t('me.noCampaigns')} <Link href="/create" className="text-indigo-300 underline">{t('me.createOne')}</Link></p>
            ) : (
              <ul className="flex flex-col gap-2">
                {created.map((r) => (
                  <li key={r.address} className="glass flex items-center justify-between rounded-xl border border-white/10 p-3 text-sm">
                    <Link href={`/campaign/${r.address}`} className="truncate hover:underline">{r.meta?.title ?? r.address.slice(0, 10) + '…'}</Link>
                    <Link href="/creator" className="text-xs text-indigo-300 underline">manage</Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">{t('me.following')}</h2>
        {followed.length === 0 ? (
          <p className="text-sm opacity-60">{t('me.noFollowing')}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {followed.map((r) => (
              <li key={r.address} className="glass flex items-center justify-between rounded-xl border border-white/10 p-3 text-sm">
                <Link href={`/campaign/${r.address}`} className="truncate hover:underline">{r.meta?.title ?? r.address.slice(0, 10) + '…'}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
