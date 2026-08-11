import { NextResponse } from 'next/server';

const DEFAULT_REGISTRY = 'CDBHJ72ROMTWZC6OIL6TDCUFH6VJOB4CSODT5H6S6DJCQQAJQHBHY6R7';
const DEFAULT_ROUTER   = 'CDKY4A5PUKHBA43ZSIQHVCBH5EBV3JQAPWWC4SV6ZKPILFTVYEY4ECFB';

/**
 * GET /api/contracts/config
 *
 * Returns the active Soroban contract addresses and network configuration.
 * The `isConfigured` flag is true only when both contract IDs come from
 * environment variables (not hardcoded defaults).
 */
export async function GET() {
  const registryEnv = process.env.NEXT_PUBLIC_CONTRACT_REGISTRY?.trim();
  const routerEnv   = process.env.NEXT_PUBLIC_CONTRACT_ROUTER?.trim();
  const network     = process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? 'testnet';
  const horizonUrl  = process.env.NEXT_PUBLIC_HORIZON_URL ?? 'https://horizon-testnet.stellar.org';

  const isConfigured = Boolean(
    registryEnv &&
    routerEnv &&
    !registryEnv.includes('CHANGE_ME') &&
    !routerEnv.includes('CHANGE_ME'),
  );

  const registryContractId = registryEnv ?? DEFAULT_REGISTRY;
  const routerContractId   = routerEnv   ?? DEFAULT_ROUTER;

  return NextResponse.json({
    network,
    horizonUrl,
    registryContractId,
    routerContractId,
    explorerBase:
      network === 'mainnet'
        ? 'https://stellar.expert/explorer/public'
        : 'https://stellar.expert/explorer/testnet',
    mode: isConfigured ? 'live' : 'preview',
    isConfigured,
  });
}
