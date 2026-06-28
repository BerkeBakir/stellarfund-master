import * as Sentry from '@sentry/nextjs';

// DSN-gated init: Sentry only activates when NEXT_PUBLIC_SENTRY_DSN is set, so
// the app builds and runs cleanly without a Sentry account. Add the DSN in
// Vercel env vars to enable production error tracking.
export function initSentry() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    enabled: process.env.NODE_ENV === 'production',
  });
}

export { Sentry };
