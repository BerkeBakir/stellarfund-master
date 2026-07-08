'use client';
import { useEffect } from 'react';
import { restoreConnection } from '@/lib/wallet';
import { useAppStore } from '@/store';
import { track } from '@/lib/track';

// Re-hydrates the wallet connection after a full page load / hard refresh, so
// the user stays "connected" when they land directly on a campaign page.
export default function WalletRestore() {
  const setWallet = useAppStore((s) => s.setWallet);
  useEffect(() => {
    let active = true;
    restoreConnection()
      .then((addr) => {
        if (active && addr) {
          setWallet(addr);
          // Count a connect once per browser session (restored sessions included)
          // so the funnel reflects connected wallets, not just fresh clicks.
          try {
            if (sessionStorage.getItem('sf.connectTracked') !== '1') {
              sessionStorage.setItem('sf.connectTracked', '1');
              track('connect', { wallet: addr });
            }
          } catch {
            /* ignore */
          }
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [setWallet]);
  return null;
}
