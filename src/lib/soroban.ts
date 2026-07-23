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
  const registryContractId = process.env.NEXT_PUBLIC_CONTRACT_REGISTRY?.trim();
  const routerContractId = process.env.NEXT_PUBLIC_CONTRACT_ROUTER?.trim();
  const hasRealContractIds = Boolean(
    registryContractId && routerContractId && !registryContractId.includes('CHANGE_ME') && !routerContractId.includes('CHANGE_ME'),
  );

  return {
    network,
    horizonUrl,
    registryContractId,
    routerContractId,
    isConfigured: hasRealContractIds,
    mode: hasRealContractIds ? 'live' : 'preview',
  };
}
