'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';
import type { MessageKey } from '@/i18n/messages';

// Global slide-in navigation. A fixed hamburger button (top-right) opens a panel
// with every product surface so the L7 features are always one tap away.
const LINKS: [string, string, MessageKey][] = [
  ['/', '🏠', 'menu.home'],
  ['/me', '👤', 'menu.me'],
  ['/creator', '🧑‍🚀', 'menu.creator'],
  ['/create', '➕', 'menu.create'],
  ['/proof', '🧾', 'menu.proof'],
  ['/metrics', '📊', 'menu.metrics'],
  ['/growth', '📈', 'menu.growth'],
  ['/changelog', '🗒️', 'menu.changelog'],
  ['/testimonials', '💬', 'menu.reviews'],
  ['/try', '🧪', 'menu.try'],
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <button
        aria-label="Menu"
        onClick={() => setOpen(true)}
        className="fixed right-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/50 backdrop-blur hover:bg-white/10"
      >
        <div className="flex flex-col gap-1">
          <span className="block h-0.5 w-5 bg-white" />
          <span className="block h-0.5 w-5 bg-white" />
          <span className="block h-0.5 w-5 bg-white" />
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <nav
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col gap-1 border-l border-white/10 bg-[#0b0a14] p-4 shadow-2xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold text-gradient">StellarFund</span>
              <button aria-label="Close" onClick={() => setOpen(false)} className="rounded-lg px-2 py-1 text-lg opacity-60 hover:opacity-100">✕</button>
            </div>
            {LINKS.map(([href, icon, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10"
              >
                <span className="w-5 text-center">{icon}</span>
                <span>{t(label)}</span>
              </Link>
            ))}
            <a
              href="https://github.com/BerkeBakir/stellarfund-master"
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm opacity-70 hover:bg-white/10"
            >
              <span className="w-5 text-center">⭐</span>
              <span>{t('menu.github')}</span>
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
