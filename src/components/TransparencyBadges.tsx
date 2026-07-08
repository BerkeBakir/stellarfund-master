import { explorerContractUrl } from '@/lib/config';

// Static trust signals shown on every campaign — reinforces that funds are
// code-enforced, not custodial.
export default function TransparencyBadges({ address }: { address: string }) {
  const badges = [
    { icon: '🔗', label: 'On-chain verified', note: 'This campaign is a real smart contract deployed on Stellar mainnet — you can inspect it yourself.' },
    { icon: '🔒', label: 'Milestone escrow', note: 'Your money is held by the contract and released to the creator tranche-by-tranche, only as each milestone is met — never all at once.' },
    { icon: '↩️', label: 'Refunds by code', note: 'If the goal is not reached by the deadline, backers can reclaim their contribution automatically — the code enforces it, not a person.' },
  ];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <span key={b.label} title={b.note} className="flex cursor-help items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs">
            <span>{b.icon}</span>
            <span className="opacity-80">{b.label}</span>
          </span>
        ))}
      </div>
      <p className="text-[11px] opacity-55">
        Funds are escrowed by the contract, released only as milestones are met, and refundable
        if the goal is missed. Hover each badge for details.
      </p>
      <a href={explorerContractUrl(address)} target="_blank" rel="noreferrer" className="text-xs text-indigo-300 underline">
        View this contract on stellar.expert →
      </a>
    </div>
  );
}
