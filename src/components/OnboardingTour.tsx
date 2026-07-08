'use client';
import { useEffect, useState } from 'react';

// First-run guided tour to lift the visit→connect→contribute funnel. Centered
// spotlight card, dismissed once (localStorage sf.tourDone).
const STEPS = [
  {
    icon: '👛',
    title: 'Connect a wallet',
    body: 'Freighter, xBull, Albedo, Lobstr and more — no sign-up, no email. Your wallet is your identity.',
    hint: 'Look for “Connect wallet” at the top of the page.',
  },
  {
    icon: '🔎',
    title: 'Find a campaign',
    body: 'Browse by category or search. Every campaign is milestone-escrowed — funds unlock only as goals are met.',
    hint: 'Scroll to the Campaigns section on the home page.',
  },
  {
    icon: '⚡',
    title: 'Contribute in seconds',
    body: 'Back a project with XLM (minimum 0.25). Milestones and refunds are enforced by the smart contract.',
    hint: 'Open a campaign and use “Support with XLM”.',
  },
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-[#141026] to-[#0b0a14] p-7 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 text-4xl">
            {s.icon}
          </div>
          <button onClick={close} className="text-sm opacity-50 hover:opacity-100">skip</button>
        </div>

        <div className="text-xs font-semibold uppercase tracking-wide text-fuchsia-300">
          Step {step + 1} of {STEPS.length}
        </div>
        <h2 className="mt-1 text-2xl font-bold">{s.title}</h2>
        <p className="mt-2 text-sm opacity-80">{s.body}</p>
        <div className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs opacity-70">
          👉 {s.hint}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === step ? 'bg-fuchsia-400' : 'bg-white/20'}`} />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep((n) => n - 1)} className="rounded-lg border border-white/10 px-4 py-2 text-sm">Back</button>
            )}
            <button
              onClick={() => (last ? close() : setStep((n) => n + 1))}
              className="rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2 text-sm font-medium text-white"
            >
              {last ? 'Start exploring' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
