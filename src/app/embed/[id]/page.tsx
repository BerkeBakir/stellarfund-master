import { getSummary } from '@/lib/campaign';
import { STATIC_META } from '@/lib/metadata';
import { stroopsToXlm, pct } from '@/lib/format';

// Minimal, iframe-friendly campaign widget. Embed with:
// <iframe src="https://stellarfund-master.vercel.app/embed/<id>" width="360" height="200" />
export default async function EmbedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let raised = 0n;
  let goal = 0n;
  try {
    const s = await getSummary(id);
    raised = s.raised;
    goal = s.goal;
  } catch {
    /* show zeros if unreadable */
  }
  const title = STATIC_META[id]?.title ?? 'StellarFund campaign';
  const p = pct(raised, goal);
  const base = 'https://stellarfund-master.vercel.app';

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: 'white', background: 'linear-gradient(135deg,#1e1b4b,#4c1d95)', padding: 16, borderRadius: 12 }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>StellarFund · milestone escrow</div>
      <div style={{ fontSize: 18, fontWeight: 700, margin: '6px 0' }}>{title}</div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${p}%`, height: '100%', background: 'linear-gradient(90deg,#818cf8,#e879f9)' }} />
      </div>
      <div style={{ fontSize: 13, marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
        <span>{stroopsToXlm(raised)} / {stroopsToXlm(goal)} XLM</span>
        <a href={`${base}/campaign/${id}`} target="_blank" rel="noreferrer" style={{ color: '#c4b5fd' }}>Back →</a>
      </div>
    </div>
  );
}
