'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '@/store';
import { useI18n } from '@/i18n/I18nProvider';

export default function FeedbackForm() {
  const { publicKey } = useAppStore();
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!message.trim()) return;
    setBusy(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message, rating, wallet: publicKey, locale }),
      });
      if (!res.ok) throw new Error('Failed to send feedback');
      toast.success(locale === 'tr' ? 'Teşekkürler! Geri bildirim alındı.' : 'Thanks for the feedback!');
      setMessage('');
      setRating(null);
      setOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to send feedback');
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur hover:bg-white/15"
      >
        💬 {locale === 'tr' ? 'Geri bildirim' : 'Feedback'}
      </button>
    );
  }

  return (
    <div className="glass fixed bottom-4 left-4 z-40 flex w-72 flex-col gap-2 rounded-xl border border-white/15 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">
          {locale === 'tr' ? 'Görüşün nedir?' : 'How was it?'}
        </span>
        <button onClick={() => setOpen(false)} className="text-xs opacity-60">
          ✕
        </button>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            className={`text-lg ${rating && n <= rating ? 'opacity-100' : 'opacity-30'}`}
          >
            ⭐
          </button>
        ))}
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder={locale === 'tr' ? 'Düşünceni yaz…' : 'Tell us what you think…'}
        className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm"
      />
      <button
        onClick={submit}
        disabled={busy || !message.trim()}
        className="rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
      >
        {busy ? '…' : locale === 'tr' ? 'Gönder' : 'Send'}
      </button>
    </div>
  );
}
