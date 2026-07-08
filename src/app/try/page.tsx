import Link from 'next/link';

export const metadata = {
  title: 'Try it free (testnet) — StellarFund',
  description: 'Experience the full StellarFund flow on Stellar testnet — no real funds needed.',
};

// Acquisition funnel: let newcomers experience the product risk-free on testnet
// before contributing real XLM on mainnet. Points to the frozen L4/L5 testnet
// deployments (same product, free faucet).
export default function TryPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-col gap-1">
        <Link href="/" className="text-xs text-indigo-300 underline">← back</Link>
        <h1 className="text-2xl font-bold text-gradient">Try it free — no real money</h1>
        <p className="text-sm opacity-70">
          New to Stellar? Walk through the entire flow — connect a wallet, get free test tokens,
          and contribute to a campaign — on <strong>testnet</strong>. Nothing costs real money.
        </p>
      </header>

      <ol className="flex flex-col gap-3">
        {[
          ['Open the testnet app', 'A full copy of StellarFund running on Stellar testnet.'],
          ['Get free test XLM/USDC', 'One tap funds your wallet — no faucet hunting.'],
          ['Contribute to a demo campaign', 'A real, wallet-signed testnet transaction you can verify.'],
          ['Ready for the real thing?', 'Come back here and contribute real XLM on mainnet.'],
        ].map(([t, d], i) => (
          <li key={t} className="glass flex gap-3 rounded-xl border border-white/10 p-4">
            <span className="text-lg font-bold text-gradient">{i + 1}</span>
            <div>
              <div className="font-medium">{t}</div>
              <div className="text-sm opacity-70">{d}</div>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-3">
        <a href="https://stellarfund-blue.vercel.app" target="_blank" rel="noreferrer" className="rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
          Open the testnet app →
        </a>
        <Link href="/" className="rounded-lg border border-white/10 px-4 py-2 text-sm">Back to mainnet</Link>
      </div>
      <p className="text-xs opacity-50">Testnet activity is for learning and does not count toward mainnet proof.</p>
    </main>
  );
}
