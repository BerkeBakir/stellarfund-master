'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProofData } from '@/lib/proof';
import { stroopsToXlm } from '@/lib/format';
import { SOCIAL, followerGrowth } from '@/lib/growthReport';
import type { Funnel } from '@/lib/retention';

type Analytics = {
  totalEvents: number;
  funnel: Funnel;
  newWalletsThisWeek: number;
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
        <Link href="/" className="text-xs text-indigo-300 underline">← back</Link>
        <h1 className="text-2xl font-bold text-gradient">Live metrics</h1>
        <p className="text-sm opacity-70">
          Building in public. On-chain figures are computed live from the contracts; social figures
          are self-reported.
        </p>
      </header>

      {loading && <p className="text-sm opacity-60">Loading live metrics…</p>}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Unique backers" value={String(proof.uniqueBackers)} note="on-chain" />
        <Tile label="Contributions" value={String(proof.totalContributions)} note="on-chain" />
        <Tile label="Volume (XLM)" value={stroopsToXlm(proof.totalVolume)} note="on-chain" />
        <Tile label="New wallets / 7d" value={String(a?.newWalletsThisWeek ?? 0)} note="analytics" />
      </section>

      <section className="glass rounded-xl border border-white/10 p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-70">Funnel (all time)</h3>
        <div className="flex flex-col gap-2 text-sm">
          {[
            ['Visits', f?.visits ?? 0],
            ['Wallet connects', f?.connects ?? 0],
            ['Contribute intents', f?.contributeIntents ?? 0],
            ['Shares', f?.shares ?? 0],
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
          <p className="mt-1 text-xs opacity-60">Visit → contribute-intent conversion: {conv}%</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Followers" value={String(SOCIAL.followers)} note="self-reported" />
        <Tile label="Followers gained" value={`+${followerGrowth()}`} note="self-reported" />
        <Tile label="Update posts" value={String(SOCIAL.updatePosts)} note="self-reported" />
        <Tile label="Community" value={String(SOCIAL.communityContributions)} note="self-reported" />
      </section>

      <p className="text-xs opacity-50">
        See the full <Link href="/growth" className="underline">monthly growth report</Link>.
      </p>
    </main>
  );
}
