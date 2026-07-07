'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '@/store';
import { truncate } from '@/lib/format';

type Comment = { campaign: string; author: string; body: string; at: string };

// Public comments on a campaign. Anyone can read; wallet optional to post.
export default function Comments({ id }: { id: string }) {
  const publicKey = useAppStore((s) => s.publicKey);
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const res = await fetch(`/api/comments?campaign=${encodeURIComponent(id)}`);
      if (res.ok) setComments((await res.json()).comments ?? []);
    } catch {
      /* ignore */
    }
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  async function submit() {
    if (!body.trim()) return;
    setBusy(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ campaign: id, body, author: publicKey ?? 'anon' }),
      });
      if (res.ok) { setBody(''); load(); }
      else toast.error('Could not post');
    } catch {
      toast.error('Could not post');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="glass rounded-xl border border-white/10 p-4">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">Comments</h3>
      <div className="mb-3 flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm"
        />
        <button onClick={submit} disabled={busy} className="rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-50">Post</button>
      </div>
      {comments.length === 0 ? (
        <p className="text-sm opacity-50">No comments yet — be the first.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {comments.map((c) => (
            <li key={c.at} className="text-sm">
              <span className="font-mono text-xs opacity-60">{c.author === 'anon' ? 'anon' : truncate(c.author)}</span>
              <span className="ml-2">{c.body}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
