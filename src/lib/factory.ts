import { simulateRead, invoke, nativeToScVal, Address, xdr } from './soroban';
import { FACTORY_ID } from './config';

export async function listCampaigns(): Promise<string[]> {
  const raw = (await simulateRead(FACTORY_ID, 'list_campaigns')) as unknown[];
  return (raw ?? []).map((a) => String(a));
}

/**
 * Create a campaign with a milestone schedule. `milestones` must sum to `goal`
 * (validated on-chain). Amounts are in USDC base units (7 decimals).
 */
export async function createCampaign(
  pk: string,
  goal: bigint,
  deadline: number,
  milestones: bigint[],
): Promise<string> {
  const milestonesVec = xdr.ScVal.scvVec(
    milestones.map((m) => nativeToScVal(m, { type: 'i128' })),
  );
  await invoke(pk, FACTORY_ID, 'create_campaign', [
    new Address(pk).toScVal(),
    nativeToScVal(goal, { type: 'i128' }),
    nativeToScVal(BigInt(deadline), { type: 'u64' }),
    milestonesVec,
  ]);
  // The Factory appends new campaigns, so the last entry is the one just
  // created. Retry briefly to absorb RPC indexing lag.
  for (let i = 0; i < 5; i++) {
    const list = await listCampaigns().catch(() => [] as string[]);
    if (list.length > 0) return list[list.length - 1];
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error('Campaign created but its address could not be resolved.');
}
