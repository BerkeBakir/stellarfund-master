'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/track';

// Records a 'visit' event on every route change. Reads ?ref= for referral attribution.
export default function PageTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const ref =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('ref') ?? undefined
        : undefined;
    track('visit', ref ? { ref } : {});
  }, [pathname]);
  return null;
}
