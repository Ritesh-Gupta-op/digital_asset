import { NextResponse } from 'next/server';

export async function GET() {
  const registryContractId =
    process.env.NEXT_PUBLIC_CONTRACT_REGISTRY ?? 'CDBHJ72ROMTWZC6OIL6TDCUFH6VJOB4CSODT5H6S6DJCQQAJQHBHY6R7';
  const routerContractId =
    process.env.NEXT_PUBLIC_CONTRACT_ROUTER ?? 'CDKY4A5PUKHBA43ZSIQHVCBH5EBV3JQAPWWC4SV6ZKPILFTVYEY4ECFB';
  const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? 'testnet';
  const horizonUrl = process.env.NEXT_PUBLIC_HORIZON_URL ?? 'https://horizon-testnet.stellar.org';

  return NextResponse.json({
    network,
    horizonUrl,
    registryContractId,
    routerContractId,
    explorerBase:
      network === 'mainnet'
        ? 'https://stellar.expert/explorer/public'
        : 'https://stellar.expert/explorer/testnet',
    mode: 'live',
  });
}
