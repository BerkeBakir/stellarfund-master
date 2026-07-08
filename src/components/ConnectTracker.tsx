'use client';
import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { track } from '@/lib/track';

// Fires a single 'connect' analytics event per browser session whenever a wallet
// becomes connected — no matter how (manual connect, or session restore). This is
// the reliable source of the funnel's "connects", independent of the connect UI.
export default function ConnectTracker() {
  const publicKey = useAppStore((s) => s.publicKey);
  useEffect(() => {
    if (!publicKey) return;
    try {
      if (sessionStorage.getItem('sf.connectTracked') === '1') return;
      sessionStorage.setItem('sf.connectTracked', '1');
    } catch {
      /* ignore */
    }
    track('connect', { wallet: publicKey });
  }, [publicKey]);
  return null;
}
