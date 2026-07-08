import { ImageResponse } from 'next/og';
import { STATIC_META } from '@/lib/metadata';

export const runtime = 'nodejs';

// Dynamic Open Graph share card for a campaign. Uses static/seed metadata when
// available, else a branded generic card. Kept dependency-free (system fonts).
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const meta = STATIC_META[id];
  const title = meta?.title ?? 'Milestone-escrow crowdfunding on Stellar';
  const category = meta?.category ?? 'StellarFund';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #831843 100%)',
          padding: 64,
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 30, opacity: 0.8, display: 'flex' }}>StellarFund · {category}</div>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, display: 'flex' }}>{title}</div>
        <div style={{ fontSize: 28, opacity: 0.85, display: 'flex' }}>
          Milestone escrow · refunds by code · on Stellar mainnet
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
