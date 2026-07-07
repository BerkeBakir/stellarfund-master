// Client helpers for campaign updates (Tier-2 retention/engagement).
export type CampaignUpdate = {
  campaign: string;
  title: string;
  body: string;
  author: string;
  at: string;
};

export async function getUpdates(campaign: string): Promise<CampaignUpdate[]> {
  try {
    const res = await fetch(`/api/updates?campaign=${encodeURIComponent(campaign)}`);
    if (!res.ok) return [];
    return ((await res.json()).updates ?? []) as CampaignUpdate[];
  } catch {
    return [];
  }
}

export async function postUpdate(input: {
  campaign: string;
  title: string;
  body: string;
  author: string;
}): Promise<void> {
  const res = await fetch('/api/updates', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const b = await res.json().catch(() => ({}));
    throw new Error(b.error ?? `Failed to post update (${res.status}).`);
  }
}
