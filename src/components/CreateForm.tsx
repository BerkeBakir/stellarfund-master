'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createCampaign } from '@/lib/factory';
import { useAppStore } from '@/store';
import { xlmToStroops, stroopsToXlm } from '@/lib/format';
import { CATEGORIES, putMetadata, uploadCover } from '@/lib/metadata';
import { useI18n } from '@/i18n/I18nProvider';

function parse(amount: string): bigint | null {
  try {
    const v = xlmToStroops(amount);
    return v > 0n ? v : null;
  } catch {
    return null;
  }
}

export default function CreateForm() {
  const { t } = useI18n();
  const router = useRouter();
  const { connected, publicKey } = useAppStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [creatorName, setCreatorName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [goal, setGoal] = useState('');
  const [days, setDays] = useState('7');
  const [milestones, setMilestones] = useState<string[]>(['', '']);
  const [busy, setBusy] = useState(false);

  const goalUnits = parse(goal);
  const daysOk = /^\d+$/.test(days) && Number(days) >= 1;
  const titleOk = title.trim().length > 0;

  const milestoneUnits = useMemo(() => milestones.map(parse), [milestones]);
  const allMilestonesOk = milestoneUnits.every((m) => m !== null);
  const sum = milestoneUnits.reduce<bigint>((a, m) => a + (m ?? 0n), 0n);
  const sumMatchesGoal = goalUnits !== null && allMilestonesOk && sum === goalUnits;

  const canSubmit =
    connected && titleOk && goalUnits !== null && daysOk && sumMatchesGoal && !busy;

  function setMilestone(i: number, v: string) {
    setMilestones((prev) => prev.map((m, idx) => (idx === i ? v : m)));
  }
  function addMilestone() {
    setMilestones((prev) => [...prev, '']);
  }
  function removeMilestone(i: number) {
    setMilestones((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  }

  async function submit() {
    if (!publicKey || goalUnits === null) return;
    setBusy(true);
    try {
      const deadline = Math.floor(Date.now() / 1000) + Number(days) * 86400;
      const ms = milestoneUnits.map((m) => m as bigint);
      const address = await createCampaign(publicKey, goalUnits, deadline, ms);
      toast.success('Campaign created on-chain!');

      // Best-effort: save identity metadata (image + fields). If it fails the
      // campaign still exists on-chain and shows the address fallback.
      try {
        let imageUrl: string | null = null;
        if (imageFile) imageUrl = await uploadCover(address, imageFile);
        await putMetadata({
          address,
          title: title.trim(),
          description: description.trim(),
          category,
          creatorName: creatorName.trim(),
          imageUrl,
          createdAt: new Date().toISOString(),
        });
      } catch {
        toast.message('Saved on-chain; details could not be saved — you can retry later.');
      }
      router.push('/');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create campaign.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass flex flex-col gap-3 rounded-xl border border-white/10 p-5">
      <label className="text-sm font-medium">{t('cf.title')}</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t('cf.titlePh')}
        className="rounded-lg border border-white/10 bg-transparent px-3 py-2"
      />
      {title !== '' && !titleOk && <span className="text-xs text-red-400">{t('cf.titleReq')}</span>}

      <label className="text-sm font-medium">{t('cf.desc')}</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder={t('cf.descPh')}
        className="rounded-lg border border-white/10 bg-transparent px-3 py-2"
      />

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{t('cf.category')}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-white/10 bg-transparent px-3 py-2"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#0a0813]">
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{t('cf.creatorName')}</label>
          <input
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder={t('cf.creatorNamePh')}
            className="rounded-lg border border-white/10 bg-transparent px-3 py-2"
          />
        </div>
      </div>

      <label className="text-sm font-medium">{t('cf.cover')}</label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white"
      />

      <label className="mt-2 text-sm font-medium">{t('cf.goal')}</label>
      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        inputMode="decimal"
        placeholder="100"
        className="rounded-lg border border-white/10 bg-transparent px-3 py-2"
      />
      {goal !== '' && goalUnits === null && (
        <span className="text-xs text-red-400">{t('cf.goalErr')}</span>
      )}

      <label className="text-sm font-medium">{t('cf.duration')}</label>
      <input
        value={days}
        onChange={(e) => setDays(e.target.value)}
        inputMode="numeric"
        className="rounded-lg border border-white/10 bg-transparent px-3 py-2"
      />
      {!daysOk && <span className="text-xs text-red-400">{t('cf.durationErr')}</span>}

      <div className="mt-2 flex items-center justify-between">
        <label className="text-sm font-medium">{t('cf.milestonesSum')}</label>
        <button type="button" onClick={addMilestone} className="text-xs text-indigo-300 underline">
          {t('cf.add')}
        </button>
      </div>
      {milestones.map((m, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-5 text-xs opacity-60">{i + 1}</span>
          <input
            value={m}
            onChange={(e) => setMilestone(i, e.target.value)}
            inputMode="decimal"
            placeholder="50"
            className="flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2"
          />
          {milestones.length > 1 && (
            <button
              type="button"
              onClick={() => removeMilestone(i)}
              className="text-xs opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <div className="flex justify-between text-xs">
        <span className="opacity-60">
          {t('cf.sum')}: {stroopsToXlm(sum)} {goalUnits !== null ? `/ ${stroopsToXlm(goalUnits)}` : ''} XLM
        </span>
        {goalUnits !== null && allMilestonesOk && !sumMatchesGoal && (
          <span className="text-red-400">{t('cf.sumErr')}</span>
        )}
        {sumMatchesGoal && <span className="text-emerald-400">{t('cf.sumOk')}</span>}
      </div>

      <button
        onClick={submit}
        disabled={!canSubmit}
        className="mt-1 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 font-medium text-white disabled:opacity-40"
      >
        {busy ? t('cf.creating') : t('cf.create')}
      </button>
      {!connected && <span className="text-xs opacity-60">{t('cd.connectFirst')}</span>}
    </div>
  );
}
