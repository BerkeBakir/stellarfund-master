'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProofData, type ProofData } from '@/lib/proof';
import { stroopsToXlm, truncate } from '@/lib/format';
import { explorerAccountUrl, explorerTxUrl } from '@/lib/config';
import { useI18n } from '@/i18n/I18nProvider';

export default function ProofPage() {
  const { t } = useI18n();
  const [data, setData] = useState<ProofData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const d = await getProofData();
        if (active) setData(d);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : t('proof.error'));
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-col gap-1">
        <Link href="/" className="text-xs text-indigo-300 underline">
          {t('back')}
        </Link>
        <h1 className="text-2xl font-bold text-gradient">{t('proof.title')}</h1>
        <p className="text-sm opacity-70">{t('proof.subtitle')}</p>
      </header>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {!data && !error && <p className="text-sm opacity-60">{t('proof.reading')}</p>}

      {data && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Stat label={t('proof.uniqueBackers')} value={String(data.uniqueBackers)} />
            <Stat label={t('proof.contributions')} value={String(data.totalContributions)} />
            <Stat label={t('proof.volume')} value={stroopsToXlm(data.totalVolume)} />
          </div>

          {data.backers.length === 0 ? (
            <p className="text-sm opacity-60">{t('proof.empty')}</p>
          ) : (
            <div className="glass overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-left text-xs uppercase opacity-70">
                  <tr>
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">{t('proof.wallet')}</th>
                    <th className="px-3 py-2">XLM</th>
                    <th className="px-3 py-2">{t('proof.tx')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.backers.map((b, i) => (
                    <tr key={b.address} className="border-t border-white/5">
                      <td className="px-3 py-2 opacity-60">{i + 1}</td>
                      <td className="px-3 py-2">
                        <a
                          href={explorerAccountUrl(b.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-indigo-300 underline"
                        >
                          {truncate(b.address)}
                        </a>
                        {b.contributions > 1 && (
                          <span className="ml-2 text-xs opacity-50">×{b.contributions}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 font-mono">{stroopsToXlm(b.totalContributed)}</td>
                      <td className="px-3 py-2">
                        {b.lastTxHash ? (
                          <a
                            href={explorerTxUrl(b.lastTxHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-300 underline"
                          >
                            {t('proof.view')}
                          </a>
                        ) : (
                          <span className="opacity-40">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs opacity-50">
            {t('proof.window')} {data.windowStartLedger}–{data.latestLedger} {t('proof.retention')}
          </p>
        </>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl border border-white/10 p-4 text-center">
      <div className="text-2xl font-bold text-gradient">{value}</div>
      <div className="text-xs opacity-60">{label}</div>
    </div>
  );
}
