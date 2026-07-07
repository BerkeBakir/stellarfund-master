import { explorerContractUrl } from '@/lib/config';

// Static trust signals shown on every campaign — reinforces that funds are
// code-enforced, not custodial.
export default function TransparencyBadges({ address }: { address: string }) {
  const badges = [
    { icon: '🔗', label: 'On-chain verified', note: 'Escrow contract on Stellar mainnet' },
    { icon: '🔒', label: 'Milestone escrow', note: 'Funds release only as milestones are met' },
    { icon: '↩️', label: 'Refunds by code', note: 'Automatic refund if the goal is missed' },
  ];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <span key={b.label} title={b.note} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs">
            <span>{b.icon}</span>
            <span className="opacity-80">{b.label}</span>
          </span>
        ))}
      </div>
      <a href={explorerContractUrl(address)} target="_blank" rel="noreferrer" className="text-xs text-indigo-300 underline">
        View contract on stellar.expert →
      </a>
    </div>
  );
}
