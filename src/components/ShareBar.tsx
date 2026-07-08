'use client';
import { toast } from 'sonner';
import { useAppStore } from '@/store';
import { track } from '@/lib/track';
import { refLink } from '@/lib/validate';

// One-click sharing with referral attribution. Builds a ?ref=<wallet> link when
// a wallet is connected. Uses real <a> links (open reliably; no popup blocker).
export default function ShareBar({ path, text }: { path: string; text: string }) {
  const publicKey = useAppStore((s) => s.publicKey);
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://stellarfund-master.vercel.app';
  const u = refLink(base, path, publicKey ?? undefined);
  const enc = encodeURIComponent(u);
  const encText = encodeURIComponent(text);
  const campaign = path.startsWith('/campaign/') ? path.split('/')[2] : undefined;

  function onShare() {
    track('share', { campaign, ref: publicKey ?? undefined });
  }

  const links: [string, string][] = [
    ['X', `https://twitter.com/intent/tweet?text=${encText}&url=${enc}`],
    ['Telegram', `https://t.me/share/url?url=${enc}&text=${encText}`],
    ['WhatsApp', `https://wa.me/?text=${encText}%20${enc}`],
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="opacity-60">Share:</span>
      {links.map(([label, href]) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onShare}
          className="rounded-lg border border-white/10 px-2 py-1 hover:bg-white/10"
        >
          {label}
        </a>
      ))}
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(u);
            track('share', { campaign, ref: publicKey ?? undefined });
            toast.success('Link copied');
          } catch {
            toast.error('Copy failed');
          }
        }}
        className="rounded-lg border border-white/10 px-2 py-1 hover:bg-white/10"
      >
        Copy link
      </button>
    </div>
  );
}
