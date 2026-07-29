import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'licensecraft-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    contracts: {
      registry: process.env.NEXT_PUBLIC_CONTRACT_REGISTRY ?? 'CDBHJ72ROMTWZC6OIL6TDCUFH6VJOB4CSODT5H6S6DJCQQAJQHBHY6R7',
      router: process.env.NEXT_PUBLIC_CONTRACT_ROUTER ?? 'CDKY4A5PUKHBA43ZSIQHVCBH5EBV3JQAPWWC4SV6ZKPILFTVYEY4ECFB',
    },
    network: process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? 'testnet',
  });
}
