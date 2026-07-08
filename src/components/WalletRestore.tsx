'use client';
import { useEffect } from 'react';
import { restoreConnection } from '@/lib/wallet';
import { useAppStore } from '@/store';

// Re-hydrates the wallet connection after a full page load / hard refresh, so
// the user stays "connected" when they land directly on a campaign page.
export default function WalletRestore() {
  const setWallet = useAppStore((s) => s.setWallet);
  useEffect(() => {
    let active = true;
    restoreConnection()
      .then((addr) => {
        if (active && addr) setWallet(addr);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [setWallet]);
  return null;
}
