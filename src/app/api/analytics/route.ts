import { NextResponse } from 'next/server';
import { readEvents } from '@/lib/eventsRead';
import { funnel, weeklyCohorts, referralLeaders, newVsReturning } from '@/lib/retention';

// GET /api/analytics -> aggregate first-party analytics (counts only, no PII).
// Public: powers the build-in-public /metrics board and the /stats panel.
export async function GET() {
  const events = await readEvents();
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  return NextResponse.json({
    totalEvents: events.length,
    funnel: funnel(events),
    cohorts: weeklyCohorts(events),
    referralLeaders: referralLeaders(events).slice(0, 10),
    newWalletsThisWeek: newVsReturning(events, weekAgo).newWallets,
  });
}
