import Link from 'next/link';
import CampaignDetail from '@/components/CampaignDetail';
import WalletBar from '@/components/WalletBar';

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="mx-auto max-w-md p-4 sm:p-6 flex flex-col gap-4">
      <Link href="/" className="text-sm opacity-70">← Back</Link>
      <h1 className="text-xl font-bold break-all">Campaign</h1>
      <WalletBar />
      <CampaignDetail id={id} />
    </main>
  );
}
