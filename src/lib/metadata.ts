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

// Built-in identity for launch/seed campaigns so they show a title + cover even
// before (or without) the Vercel Blob metadata store being configured.
export const STATIC_META: Record<string, CampaignMeta> = {
  CCZ2RNDOPBET3X4VSWMLMAHUVCTQ6OUWNW6M4IE2U4TZR35ZZ27DKXNK: {
    address: 'CCZ2RNDOPBET3X4VSWMLMAHUVCTQ6OUWNW6M4IE2U4TZR35ZZ27DKXNK',
    title: 'Clean water for a village school',
    description:
      'Funding a solar-powered water pump and storage tank so a rural school has safe drinking water year-round. Released in two milestones as the pump and tank are installed.',
    category: 'Community',
    creatorName: 'StellarFund',
    imageUrl: '/covers/seed-water.svg',
    createdAt: '2026-07-06T15:30:00.000Z',
  },
  CC5JBREYQ3SMOEPUDCALF54ORS32LAH6CTJVZK5JQ5OZWR3RM4IR4STR: {
    address: 'CC5JBREYQ3SMOEPUDCALF54ORS32LAH6CTJVZK5JQ5OZWR3RM4IR4STR',
    title: 'Coding bootcamp scholarships',
    description:
      'Scholarships for students entering a 12-week coding bootcamp. Funds release in two milestones: enrolment, then completion.',
    category: 'Education',
    creatorName: 'StellarFund',
    imageUrl: '/covers/seed-education.svg',
    createdAt: '2026-07-06T15:40:00.000Z',
  },
  CDBDXMNGOP7COPXLGIEBRQJIU7LYEETLAHE7NG3G5L7WBIHC3YMYVUGO: {
    address: 'CDBDXMNGOP7COPXLGIEBRQJIU7LYEETLAHE7NG3G5L7WBIHC3YMYVUGO',
    title: 'Mobile clinic vaccination drive',
    description:
      'A mobile clinic running childhood vaccination days across remote villages. Released as each round of visits is completed.',
    category: 'Health',
    creatorName: 'StellarFund',
    imageUrl: '/covers/seed-health.svg',
    createdAt: '2026-07-06T15:41:00.000Z',
  },
  CC3UKMVA2QC4NSSW7OU2VO74NTP4D5QAEUWML63CHBUMTQDID6S523LL: {
    address: 'CC3UKMVA2QC4NSSW7OU2VO74NTP4D5QAEUWML63CHBUMTQDID6S523LL',
    title: 'Solar microgrid for a village',
    description:
      'A shared solar microgrid bringing clean electricity to homes and a small workshop. Released as panels and storage are installed.',
    category: 'Technology',
    creatorName: 'StellarFund',
    imageUrl: '/covers/seed-tech.svg',
    createdAt: '2026-07-06T15:42:00.000Z',
  },
};

// ---- client helpers (browser) ----

export async function getAllMetadata(): Promise<Record<string, CampaignMeta>> {
  let remote: Record<string, CampaignMeta> = {};
  try {
    const res = await fetch('/api/campaigns');
    if (res.ok) remote = ((await res.json()).campaigns ?? {}) as Record<string, CampaignMeta>;
  } catch {
    /* blob store not configured / offline — fall back to static metadata */
  }
  // Static entries win for known launch campaigns.
  return { ...remote, ...STATIC_META };
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
