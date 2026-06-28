import { initSentry } from './src/lib/sentry';

// Runs on server/edge startup. Client init lives in instrumentation-client.ts.
export async function register() {
  initSentry();
}

export async function onRequestError(...args: unknown[]) {
  const { Sentry } = await import('./src/lib/sentry');
  // @ts-expect-error - forward Next's request-error payload to Sentry if present
  Sentry.captureRequestError?.(...args);
}
