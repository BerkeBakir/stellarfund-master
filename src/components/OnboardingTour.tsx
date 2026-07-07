'use client';
import { useEffect, useState } from 'react';

// Lightweight first-run guided tour to lift the visit→connect→contribute funnel.
// Dismissed state persists in localStorage so it shows once.
const STEPS = [
  { icon: '👛', title: 'Connect a wallet', body: 'Freighter, xBull, Albedo and more. No sign-up.' },
  { icon: '🔎', title: 'Find a campaign', body: 'Browse by category or search. Every campaign is milestone-escrowed.' },
  { icon: '⚡', title: 'Contribute gasless', body: 'Back a project with XLM — network fees are sponsored for you.' },
];

export default function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem('sf.tourDone') !== '1') setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  function close() {
    try { localStorage.setItem('sf.tourDone', '1'); } catch { /* ignore */ }
    setOpen(false);
  }

  if (!open) return null;
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 mx-auto flex max-w-sm flex-col gap-3 rounded-2xl border border-white/10 bg-black/80 p-5 backdrop-blur">
      <div className="flex items-start justify-between">
        <div className="text-3xl">{s.icon}</div>
        <button onClick={close} className="text-xs opacity-50 hover:opacity-100">skip</button>
      </div>
      <div>
        <div className="font-semibold">{s.title}</div>
        <div className="text-sm opacity-70">{s.body}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === step ? 'bg-fuchsia-400' : 'bg-white/20'}`} />
          ))}
        </div>
        <button
          onClick={() => (last ? close() : setStep((n) => n + 1))}
          className="rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-1.5 text-sm font-medium text-white"
        >
          {last ? 'Got it' : 'Next'}
        </button>
      </div>
    </div>
  );
}
