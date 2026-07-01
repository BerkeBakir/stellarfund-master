'use client';
import { HORIZON_URL } from './config';

/**
 * Read the wallet's native XLM balance from Horizon. Returns null when the
 * account doesn't exist yet (unfunded), so callers can tell "no account" apart
 * from "zero balance". On mainnet there is no faucet — users fund with real XLM.
 */
export async function getXlmBalance(publicKey: string): Promise<number | null> {
  try {
    const res = await fetch(`${HORIZON_URL}/accounts/${publicKey}`);
    if (!res.ok) return null;
    const data = await res.json();
    const line = (data.balances ?? []).find(
      (b: { asset_type?: string }) => b.asset_type === 'native',
    );
    return line ? Number(line.balance) : null;
  } catch {
    return null;
  }
}
