'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { openWalletModal, disconnect } from '@/lib/wallet';
import { getXlmBalance } from '@/lib/onboard';
import { useAppStore } from '@/store';
import { truncate } from '@/lib/format';
import { track } from '@/lib/track';

export default function WalletBar() {
  const { publicKey, connected, setWallet } = useAppStore();
  const [busy, setBusy] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }
    let active = true;
    getXlmBalance(publicKey).then((b) => {
      if (active) setBalance(b);
    });
    return () => {
      active = false;
    };
  }, [publicKey]);

  async function connect() {
    setBusy(true);
    try {
      const pk = await openWalletModal();
      setWallet(pk);
      track('connect', { wallet: pk ?? undefined });
      toast.success('Wallet connected.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to connect.');
    } finally {
      setBusy(false);
    }
  }
  async function handleDisconnect() {
    try {
      await disconnect();
    } catch {
      /* ignore */
    }
    setWallet(null);
  }

  if (!connected || !publicKey) {
    return (
      <div className="glass flex items-center justify-between gap-3 rounded-xl border border-white/10 p-3">
        <span className="text-sm opacity-70">Connect a wallet to start</span>
        <button
          onClick={connect}
          disabled={busy}
          className="rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? 'Connecting…' : 'Connect Wallet'}
        </button>
      </div>
    );
  }
  return (
    <div className="glass flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 p-3">
      <div className="flex flex-col">
        <span className="font-mono text-sm">{truncate(publicKey)}</span>
        <span className="text-xs opacity-60">
          {balance === null ? 'Account not funded yet' : `${balance.toFixed(2)} XLM`}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href="https://www.stellar.org/lumens/exchanges"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
        >
          Get XLM ↗
        </a>
        <button
          onClick={handleDisconnect}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
