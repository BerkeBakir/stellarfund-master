'use client';
import { toast } from 'sonner';
import { useAppStore } from '@/store';
import { track } from '@/lib/track';
import { refLink } from '@/lib/validate';

// One-click sharing with referral attribution. Builds a ?ref=<wallet> link when
// a wallet is connected, so shares can be attributed in analytics.
export default function ShareBar({ path, text }: { path: string; text: string }) {
  const publicKey = useAppStore((s) => s.publicKey);

  function url(): string {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://stellarfund-master.vercel.app';
    return refLink(base, path, publicKey ?? undefined);
  }

  function onShare(network: string, href: string) {
    track('share', { campaign: path.startsWith('/campaign/') ? path.split('/')[2] : undefined, ref: publicKey ?? undefined });
    window.open(href, '_blank', 'noopener,noreferrer');
    void network;
  }

  const u = url();
  const enc = encodeURIComponent(u);
  const encText = encodeURIComponent(text);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="opacity-60">Share:</span>
      <button
        onClick={() => onShare('x', `https://twitter.com/intent/tweet?text=${encText}&url=${enc}`)}
        className="rounded-lg border border-white/10 px-2 py-1 hover:bg-white/10"
      >X</button>
      <button
        onClick={() => onShare('telegram', `https://t.me/share/url?url=${enc}&text=${encText}`)}
        className="rounded-lg border border-white/10 px-2 py-1 hover:bg-white/10"
      >Telegram</button>
      <button
        onClick={() => onShare('whatsapp', `https://wa.me/?text=${encText}%20${enc}`)}
        className="rounded-lg border border-white/10 px-2 py-1 hover:bg-white/10"
      >WhatsApp</button>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(u);
            track('share', { ref: publicKey ?? undefined });
            toast.success('Link copied');
          } catch {
            toast.error('Copy failed');
          }
        }}
        className="rounded-lg border border-white/10 px-2 py-1 hover:bg-white/10"
      >Copy link</button>
    </div>
  );
}
