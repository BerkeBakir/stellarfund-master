'use client';
import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule, FREIGHTER_ID } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull';
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo';
import { LobstrModule } from '@creit.tech/stellar-wallets-kit/modules/lobstr';
import { RabetModule } from '@creit.tech/stellar-wallets-kit/modules/rabet';
import { HanaModule } from '@creit.tech/stellar-wallets-kit/modules/hana';
import {
  WalletConnectModule,
  WalletConnectTargetChain,
} from '@creit.tech/stellar-wallets-kit/modules/wallet-connect';
import { NETWORK_PASSPHRASE } from './config';

// Optional: enables mobile wallets (LOBSTR, etc.) via WalletConnect QR/deep-link.
// Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID (free from cloud.reown.com) to turn on.
const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const APP_URL = 'https://stellarfund-black.vercel.app';

let inited = false;
function ensureInit() {
  if (inited) return;

  // Albedo is web-based (no install needed); the rest are browser extensions
  // and only appear as connectable when the user has them installed.
  const modules = [
    new FreighterModule(),
    new AlbedoModule(),
    new xBullModule(),
    new LobstrModule(),
    new RabetModule(),
    new HanaModule(),
  ];

  if (WC_PROJECT_ID) {
    modules.push(
      new WalletConnectModule({
        projectId: WC_PROJECT_ID,
        allowedChains: [WalletConnectTargetChain.TESTNET],
        metadata: {
          name: 'StellarFund',
          description: 'Cross-border crowdfunding on Stellar',
          url: APP_URL,
          icons: [`${APP_URL}/icon.svg`],
        },
      }),
    );
  }

  StellarWalletsKit.init({
    network: NETWORK_PASSPHRASE as Networks,
    selectedWalletId: FREIGHTER_ID,
    modules,
  });
  inited = true;
}

const SAVED_KEY = 'sf.wallet.address';

export async function openWalletModal(): Promise<string> {
  ensureInit();
  const { address } = await StellarWalletsKit.authModal();
  if (!address) throw new Error('No wallet address returned.');
  try {
    localStorage.setItem(SAVED_KEY, address);
  } catch {
    /* ignore */
  }
  return address;
}

export async function disconnect(): Promise<void> {
  try {
    localStorage.removeItem(SAVED_KEY);
  } catch {
    /* ignore */
  }
  try {
    await StellarWalletsKit.disconnect();
  } catch {
    /* best effort */
  }
}

/**
 * Restore a previous session after a full page load. Only runs if the user
 * connected before (we saved the address), so it never prompts a fresh visitor.
 * Falls back to the saved address so the UI reflects the connection even if the
 * wallet is briefly unreachable; signing re-verifies through the wallet.
 */
export async function restoreConnection(): Promise<string | null> {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(SAVED_KEY);
  } catch {
    /* ignore */
  }
  if (!saved) return null;
  ensureInit();
  try {
    const { address } = await StellarWalletsKit.getAddress();
    if (address) return address;
  } catch {
    /* kit memory empty after reload — try the wallet directly */
  }
  try {
    const { address } = await StellarWalletsKit.fetchAddress();
    if (address) return address;
  } catch {
    /* wallet not immediately reachable */
  }
  return saved;
}

export async function signXdr(xdr: string, publicKey: string): Promise<string> {
  ensureInit();
  try {
    const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
      address: publicKey,
      networkPassphrase: NETWORK_PASSPHRASE,
    });
    return signedTxXdr;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Transaction signing was rejected.');
  }
}
