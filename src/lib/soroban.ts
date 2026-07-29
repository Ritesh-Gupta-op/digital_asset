export type SorobanNetwork = 'testnet' | 'mainnet';

export interface SorobanConfig {
  network: SorobanNetwork;
  horizonUrl: string;
  registryContractId?: string;
  routerContractId?: string;
  isConfigured: boolean;
  mode: 'live' | 'preview';
}

export function getSorobanConfig(network: SorobanNetwork = 'testnet'): SorobanConfig {
  const horizonUrl = process.env.NEXT_PUBLIC_HORIZON_URL ?? 'https://horizon-testnet.stellar.org';
  const registryEnv = process.env.NEXT_PUBLIC_CONTRACT_REGISTRY?.trim();
  const routerEnv = process.env.NEXT_PUBLIC_CONTRACT_ROUTER?.trim();

  const isConfiguredInEnv = Boolean(
    registryEnv && routerEnv && !registryEnv.includes('CHANGE_ME') && !routerEnv.includes('CHANGE_ME'),
  );

  const registryContractId = registryEnv || 'CDBHJ72ROMTWZC6OIL6TDCUFH6VJOB4CSODT5H6S6DJCQQAJQHBHY6R7';
  const routerContractId = routerEnv || 'CDKY4A5PUKHBA43ZSIQHVCBH5EBV3JQAPWWC4SV6ZKPILFTVYEY4ECFB';

  return {
    network,
    horizonUrl,
    registryContractId,
    routerContractId,
    isConfigured: isConfiguredInEnv,
    mode: isConfiguredInEnv ? 'live' : 'preview',
  };
}
