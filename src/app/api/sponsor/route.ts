import { NextResponse } from 'next/server';
import { rpc, TransactionBuilder, Keypair } from '@stellar/stellar-sdk';
import { RPC_URL, NETWORK_PASSPHRASE } from '@/lib/config';

// Fee Sponsorship (gasless): the user signs their inner transaction, and this
// endpoint wraps it in a fee-bump paid by the sponsor account, so the user pays
// no network fee — only the contribution amount itself. Advanced feature (L6).
//
// The sponsor secret is server-only. If it isn't configured we return
// { sponsored: false } so the client can fall back to a normal submission
// (nothing is submitted here in that case — avoids any double-submit).

const FEE_BUMP_BASE = '2000000'; // 0.2 XLM per-op cap; only the metered fee is charged

export async function POST(req: Request) {
  const secret = process.env.SPONSOR_SECRET;
  if (!secret) {
    return NextResponse.json({ sponsored: false });
  }

  let xdr: string;
  try {
    const body = await req.json();
    xdr = String(body.xdr ?? '');
    if (!xdr) throw new Error('missing xdr');
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const server = new rpc.Server(RPC_URL);
    const sponsor = Keypair.fromSecret(secret);
    const inner = TransactionBuilder.fromXDR(xdr, NETWORK_PASSPHRASE);

    const feeBump = TransactionBuilder.buildFeeBumpTransaction(
      sponsor,
      FEE_BUMP_BASE,
      // @ts-expect-error inner is a Transaction after fromXDR on a v1 envelope
      inner,
      NETWORK_PASSPHRASE,
    );
    feeBump.sign(sponsor);

    const sent = await server.sendTransaction(feeBump);
    if (sent.status === 'ERROR') {
      // The fee-bump was rejected before applying (e.g. the sponsor is out of
      // XLM). Nothing landed on-chain, so signal a fallback to direct
      // submission — the user pays the fee, but the contribution still works.
      return NextResponse.json({ sponsored: false, reason: 'sponsor_unavailable' });
    }

    let got = await server.getTransaction(sent.hash);
    const deadline = Date.now() + 60_000;
    while (got.status === 'NOT_FOUND' && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 2500));
      got = await server.getTransaction(sent.hash).catch(() => got);
    }
    if (got.status !== 'SUCCESS') {
      return NextResponse.json({ error: `Sponsored tx ended with status ${got.status}` }, { status: 502 });
    }

    return NextResponse.json({ sponsored: true, hash: sent.hash });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Sponsor error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
