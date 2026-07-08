'use client';
import { useEffect, useState } from 'react';
import { getUpdates, type CampaignUpdate } from '@/lib/updates';
import { useI18n } from '@/i18n/I18nProvider';

// Read-only feed of creator updates shown to backers on the campaign page.
export default function CampaignUpdates({ id }: { id: string }) {
  const { t } = useI18n();
  const [updates, setUpdates] = useState<CampaignUpdate[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getUpdates(id).then((u) => {
      if (active) { setUpdates(u); setLoaded(true); }
    });
    return () => { active = false; };
  }, [id]);

  if (!loaded || updates.length === 0) return null;

  return (
    <section className="glass rounded-xl border border-white/10 p-4">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">{t('cd.updates')}</h3>
      <ul className="flex flex-col gap-3">
        {updates.map((u) => (
          <li key={u.at} className="text-sm">
            <div className="font-medium">{u.title}</div>
            <div className="opacity-80">{u.body}</div>
            <div className="text-[10px] opacity-40">{new Date(u.at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
