export const NETWORK_PASSPHRASE = 'Public Global Stellar Network ; September 2015';
// gateway.fm's public mainnet Soroban RPC — it doesn't aggressively rate-limit
// browser bursts the way mainnet.sorobanrpc.com (Cloudflare 1015) does, which
// was causing "Loading campaign…" hangs, proof "failed to fetch", and flicker.
export const RPC_URL = 'https://soroban-rpc.mainnet.stellar.gateway.fm';
export const HORIZON_URL = 'https://horizon.stellar.org';
export const EXPLORER_BASE_URL = 'https://stellar.expert/explorer/public';

// StellarFund — deployed on Stellar MAINNET (Black Belt / L6), 2026-07-06.
// Deployer: GAQ5YHRV5POBZDJFP5EI5S6HOJCXVFY5LOQG76TI44D3DDEKCIANNURB
export const FACTORY_ID =
  process.env.NEXT_PUBLIC_FACTORY_ID ?? 'CBUAZAAH7R7WXP3PIBKVPHYJ3XIHUTDOYBNUPPTLDVUWI6ZK6X33ZPN2';
export const REPUTATION_ID =
  process.env.NEXT_PUBLIC_REPUTATION_ID ?? 'CCXGJUE6UXPMU27WKJZJS7XXV2NA5ZQPWLPQUJ2XNGDH5TD7L4DMAT5X';

// Native XLM via its Stellar Asset Contract (SAC) on mainnet. The escrow is
// token-agnostic, so on mainnet it custodies real XLM — no faucet, no minting.
// Users contribute small real XLM amounts. Native has no issuer/trustline.
export const TOKEN_ID = 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA';
export const TOKEN_CODE = 'XLM';
export const TOKEN_DECIMALS = 7;
export const TOKEN_ISSUER = ''; // native asset — no issuer
export const CAMPAIGN_WASM_HASH =
  process.env.NEXT_PUBLIC_CAMPAIGN_WASM_HASH ??
  'f42f7c5faae416b3a77695e9f9a8330cdad45901a1deebea894081ccf7f4f1a2';

// Campaigns hidden from the UI/analytics (broken economics). Empty on mainnet;
// their on-chain contributions would still count on /proof if any were added.
export const HIDDEN_CAMPAIGNS = new Set<string>([]);

// External user-feedback Google Forms (L7): separate TR and EN forms.
export const FEEDBACK_FORM_URL_TR =
  'https://docs.google.com/forms/d/e/1FAIpQLSf24RRiIRMArlFupeF-U5ZVfaxFDAvcUwOftGGpBdf62yuZtQ/viewform';
export const FEEDBACK_FORM_URL_EN =
  'https://docs.google.com/forms/d/e/1FAIpQLSfzFaDPjI_4iyNo4tLr1po8KYTkyd_km9tsZF0pYV30uhQFRA/viewform';

// Locale-aware picker; default (SSR / unknown) uses EN.
export function feedbackFormUrl(locale?: string): string {
  return locale === 'tr' ? FEEDBACK_FORM_URL_TR : FEEDBACK_FORM_URL_EN;
}

// Back-compat default (EN) for any non-localized call site.
export const FEEDBACK_FORM_URL = FEEDBACK_FORM_URL_EN;

// Fee Sponsorship (gasless) toggle. Disabled: contributors pay the (tiny) network
// fee themselves and no sponsor account is needed. Flip to true to re-enable.
export const GASLESS_ENABLED = false;

// Minimum contribution: 0.25 XLM (in stroops). No maximum.
export const MIN_CONTRIB_STROOPS = 2_500_000n;

// SEP-24 anchor demo. testanchor is testnet-only, so on the mainnet build the
// /ramp page is shown as a protocol demonstration and gated behind this flag.
export const ANCHOR_ENABLED = false;
export const ANCHOR_HOME_DOMAIN = 'testanchor.stellar.org';
export const ANCHOR_BASE_URL = 'https://testanchor.stellar.org';

export function explorerTxUrl(hash: string): string {
  return `${EXPLORER_BASE_URL}/tx/${hash}`;
}
export function explorerContractUrl(id: string): string {
  return `${EXPLORER_BASE_URL}/contract/${id}`;
}
export function explorerAccountUrl(addr: string): string {
  return `${EXPLORER_BASE_URL}/account/${addr}`;
}
