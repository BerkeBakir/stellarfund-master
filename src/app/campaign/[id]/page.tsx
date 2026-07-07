import type { Metadata } from 'next';
import Link from 'next/link';
import CampaignDetail from '@/components/CampaignDetail';
import CampaignUpdates from '@/components/CampaignUpdates';
import ShareBar from '@/components/ShareBar';
import FollowButton from '@/components/FollowButton';
import WalletBar from '@/components/WalletBar';
import { STATIC_META } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const title = STATIC_META[id]?.title ?? 'Campaign';
  return {
    title: `${title} — StellarFund`,
    openGraph: {
      title: `${title} — StellarFund`,
      images: [`/api/og/${id}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — StellarFund`,
      images: [`/api/og/${id}`],
    },
  };
}

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="mx-auto max-w-md p-4 sm:p-6 flex flex-col gap-4">
      <Link href="/" className="text-sm opacity-70">← Back</Link>
      <h1 className="text-xl font-bold break-all">Campaign</h1>
      <WalletBar />
      <CampaignDetail id={id} />
      <div className="flex items-center justify-between gap-2">
        <ShareBar path={`/campaign/${id}`} text="Back this campaign on StellarFund" />
        <FollowButton address={id} />
      </div>
      <CampaignUpdates id={id} />
    </main>
  );
}
