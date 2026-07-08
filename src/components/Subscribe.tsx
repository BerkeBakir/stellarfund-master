'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '@/store';
import { isValidEmail } from '@/lib/validate';
import { useI18n } from '@/i18n/I18nProvider';

// Email capture for the weekly digest. Low-friction: no wallet required.
export default function Subscribe() {
  const { t } = useI18n();
  const publicKey = useAppStore((s) => s.publicKey);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (done) {
    return <p className="text-sm text-emerald-300">{t('sub.done')}</p>;
  }

  async function submit() {
    if (!isValidEmail(email)) {
      toast.error(t('sub.invalid'));
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, wallet: publicKey }),
      });
      if (res.ok) setDone(true);
      else toast.error('Could not subscribe');
    } catch {
      toast.error('Could not subscribe');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass flex flex-col gap-2 rounded-xl border border-white/10 p-4">
      <p className="text-sm font-medium">{t('sub.title')}</p>
      <div className="flex gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder={t('sub.placeholder')}
          className="flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm"
        />
        <button
          onClick={submit}
          disabled={busy}
          className="rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? '…' : t('sub.button')}
        </button>
      </div>
    </div>
  );
}
