import { Networks } from '@stellar/stellar-sdk';

export interface ContractInteractionState {
  status: 'idle' | 'pending' | 'processing' | 'confirmed' | 'failed';
  hash?: string;
  explorerUrl?: string;
  error?: string;
}

export async function submitLicenseDraft() {
  return { networkPassphrase: Networks.TESTNET };
}

export function getExplorerUrl(hash: string) {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}
