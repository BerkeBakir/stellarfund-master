// Off-chain campaign identity, keyed by the campaign contract address and
// stored in Vercel Blob. Contracts only hold address/amounts/milestones.

export const CATEGORIES = [
  'Education',
  'Health',
  'Technology',
  'Community',
  'Emergency',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export type CampaignMeta = {
  address: string;
  title: string;
  description: string;
  category: string;
  creatorName: string;
  imageUrl: string | null;
  createdAt: string;
};

export function isValidCategory(c: string): boolean {
  return (CATEGORIES as readonly string[]).includes(c);
}

// ---- client helpers (browser) ----

export async function getAllMetadata(): Promise<Record<string, CampaignMeta>> {
  const res = await fetch('/api/campaigns');
  if (!res.ok) throw new Error(`Failed to load metadata (${res.status}).`);
  const data = await res.json();
  return (data.campaigns ?? {}) as Record<string, CampaignMeta>;
}

export async function putMetadata(meta: CampaignMeta): Promise<void> {
  const res = await fetch('/api/campaigns', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(meta),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Failed to save metadata (${res.status}).`);
  }
}

export async function uploadCover(address: string, file: File): Promise<string> {
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const res = await fetch(
    `/api/campaigns/upload?address=${encodeURIComponent(address)}&ext=${ext}`,
    { method: 'POST', headers: { 'content-type': file.type }, body: file },
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Image upload failed (${res.status}).`);
  }
  const data = await res.json();
  return data.url as string;
}
