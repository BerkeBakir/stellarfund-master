'use client';
import { useEffect, useState } from 'react';
import { isFollowing, toggleFollow } from '@/lib/follows';
import { useI18n } from '@/i18n/I18nProvider';

// Watch/unwatch a campaign (localStorage). Small, no wallet required.
export default function FollowButton({ address }: { address: string }) {
  const { t } = useI18n();
  const [following, setFollowing] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFollowing(isFollowing(address));
    setReady(true);
  }, [address]);

  if (!ready) return null;

  return (
    <button
      onClick={() => setFollowing(toggleFollow(address))}
      className={`rounded-lg border px-3 py-1.5 text-sm ${
        following ? 'border-fuchsia-400/50 bg-fuchsia-500/10 text-fuchsia-200' : 'border-white/10 hover:bg-white/10'
      }`}
    >
      {following ? t('cd.following') : t('cd.follow')}
    </button>
  );
}
