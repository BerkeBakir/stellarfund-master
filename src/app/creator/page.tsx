'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import WalletBar from '@/components/WalletBar';
import ShareBar from '@/components/ShareBar';
import { useAppStore } from '@/store';
import { listCampaigns } from '@/lib/factory';
import { getSummary } from '@/lib/campaign';
import { getAllMetadata, type CampaignMeta } from '@/lib/metadata';
import { getUpdates, postUpdate, type CampaignUpdate } from '@/lib/updates';
import { HIDDEN_CAMPAIGNS } from '@/lib/config';
import { stroopsToXlm } from '@/lib/format';
import { useI18n } from '@/i18n/I18nProvider';

type Mine = { address: string; raised: bigint; goal: bigint; meta?: CampaignMeta };

export default function CreatorPage() {
  const { t } = useI18n();
  const publicKey = useAppStore((s) => s.publicKey);
  const [mine, setMine] = useState<Mine[]>([]);
  const [loading, setLoading] = useState(false);
  const [updates, setUpdates] = useState<Record<string, CampaignUpdate[]>>({});
  const [draft, setDraft] = useState<{ addr: string; title: string; body: string } | null>(null);

  useEffect(() => {
    if (!publicKey) { setMine([]); return; }
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const [addrsRaw, meta] = await Promise.all([listCampaigns(), getAllMetadata()]);
        const addrs = addrsRaw.filter((a) => !HIDDEN_CAMPAIGNS.has(a));
        const rows = await Promise.all(
          addrs.map(async (a) => {
            try {
              const s = await getSummary(a);
              if (s.creator !== publicKey) return null;
              return { address: a, raised: s.raised, goal: s.goal, meta: meta[a] } as Mine;
            } catch {
              return null;
            }
          }),
        );
        if (active) setMine(rows.filter((r): r is Mine => r !== null));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [publicKey]);

  async function loadUpdates(addr: string) {
    setUpdates((u) => ({ ...u, [addr]: u[addr] ?? [] }));
    const list = await getUpdates(addr);
    setUpdates((u) => ({ ...u, [addr]: list }));
  }

  async function submitUpdate() {
    if (!draft || !publicKey) return;
    if (!draft.title.trim() || !draft.body.trim()) { toast.error('Title and body required'); return; }
    try {
      await postUpdate({ campaign: draft.addr, title: draft.title, body: draft.body, author: publicKey });
      toast.success('Update posted');
      setDraft(null);
      loadUpdates(draft.addr);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    }
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-col gap-1">
        <Link href="/" className="text-xs text-indigo-300 underline">{t('back')}</Link>
        <h1 className="text-2xl font-bold text-gradient">{t('creator.title')}</h1>
        <p className="text-sm opacity-70">{t('creator.subtitle')}</p>
      </header>

      <WalletBar />

      {!publicKey && <p className="text-sm opacity-60">{t('creator.connect')}</p>}
      {publicKey && loading && <p className="text-sm opacity-60">{t('creator.loading')}</p>}
      {publicKey && !loading && mine.length === 0 && (
        <p className="text-sm opacity-60">
          {t('creator.none')} <Link href="/create" className="text-indigo-300 underline">{t('me.createOne')}</Link>
        </p>
      )}

      <div className="flex flex-col gap-4">
        {mine.map((c) => (
          <div key={c.address} className="glass rounded-xl border border-white/10 p-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold">{c.meta?.title ?? c.address.slice(0, 10) + '…'}</h2>
              <span className="font-mono text-xs opacity-70">{stroopsToXlm(c.raised)} / {stroopsToXlm(c.goal)} XLM</span>
            </div>

            <div className="mb-3">
              <ShareBar path={`/campaign/${c.address}`} text={`Back "${c.meta?.title ?? 'my campaign'}" on StellarFund`} />
            </div>

            <div className="flex gap-2">
              <button onClick={() => loadUpdates(c.address)} className="rounded-lg border border-white/10 px-2 py-1 text-sm hover:bg-white/10">{t('creator.loadUpdates')}</button>
              <button onClick={() => setDraft({ addr: c.address, title: '', body: '' })} className="rounded-lg border border-white/10 px-2 py-1 text-sm hover:bg-white/10">{t('creator.postUpdate')}</button>
            </div>

            {draft?.addr === c.address && (
              <div className="mt-3 flex flex-col gap-2">
                <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder={t('creator.updateTitle')} className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm" />
                <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder={t('creator.updateBody')} rows={3} className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm" />
                <div className="flex gap-2">
                  <button onClick={submitUpdate} className="rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-1.5 text-sm font-medium text-white">{t('creator.publish')}</button>
                  <button onClick={() => setDraft(null)} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm">{t('creator.cancel')}</button>
                </div>
              </div>
            )}

            {updates[c.address]?.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
                {updates[c.address].map((u) => (
                  <li key={u.at} className="text-sm">
                    <div className="font-medium">{u.title}</div>
                    <div className="opacity-70">{u.body}</div>
                    <div className="text-[10px] opacity-40">{new Date(u.at).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
