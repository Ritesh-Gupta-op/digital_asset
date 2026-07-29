import { TransactionBuilder, Operation, Asset, Transaction } from '@stellar/stellar-sdk';
import { Horizon } from '@stellar/stellar-sdk';
import { useWalletStore } from '@/store/wallet';
import { useTransactionStore } from '@/store/transactions';

export interface ContractInteractionState {
  status: 'idle' | 'pending' | 'processing' | 'confirmed' | 'failed';
  hash?: string;
  explorerUrl?: string;
  error?: string;
}

const SERVER_URL = 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(SERVER_URL);

export function getExplorerUrl(hash: string, network: 'testnet' | 'mainnet' = 'testnet') {
  return `https://stellar.expert/explorer/${network}/tx/${hash}`;
}

import { getSorobanConfig } from '@/lib/soroban';

export async function sendXLMPayment(
  destination: string,
  amount: string,
  description: string,
) {
  const walletStore = useWalletStore.getState();
  const transactionStore = useTransactionStore.getState();
  const config = getSorobanConfig(walletStore.network);
  const contractId = config.registryContractId || 'CDBHJ72ROMTWZC6OIL6TDCUFH6VJOB4CSODT5H6S6DJCQQAJQHBHY6R7';
  
  if (!walletStore.connected || !walletStore.address) {
    throw new Error('Wallet not connected');
  }

  try {
    const txId = `tx-${Date.now()}`;
    const sourceAccount = await server.loadAccount(walletStore.address);

    const networkPassphrase = walletStore.network === 'testnet' 
      ? 'Test SDF Network ; September 2015' 
      : 'Public Global Stellar Network ; September 2015';

    const transaction = new TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase,
    })
      .addOperation(
        Operation.payment({
          destination,
          asset: Asset.native(),
          amount,
        }),
      )
      .addOperation(
        Operation.manageData({
          name: 'contract_id',
          value: contractId,
        }),
      )
      .setTimeout(30)
      .build();

    const transactionXDR = transaction.toEnvelope().toXDR('base64');
    const signedXDR = await walletStore.signTransaction(transactionXDR);
    const signedTx = TransactionBuilder.fromXDR(signedXDR, networkPassphrase);
    const result = await server.submitTransaction(signedTx);

    const explorerUrl = getExplorerUrl(result.hash, walletStore.network);
    transactionStore.add({
      id: txId,
      status: 'confirmed',
      description: `${description} [Contract: ${contractId.slice(0, 8)}...]`,
      hash: result.hash,
      explorerUrl,
      contractId,
    });

    return result;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

export async function submitLicenseDraft(
  licenseData: { title: string; terms?: string },
  recipientAddress: string,
  licenseFee: string = '10', // XLM
) {
  const walletStore = useWalletStore.getState();
  const transactionStore = useTransactionStore.getState();
  const config = getSorobanConfig(walletStore.network);
  const contractId = config.registryContractId || 'CDBHJ72ROMTWZC6OIL6TDCUFH6VJOB4CSODT5H6S6DJCQQAJQHBHY6R7';

  if (!walletStore.connected || !walletStore.address) {
    throw new Error('Wallet not connected');
  }

  try {
    const txId = `license-${Date.now()}`;
    const sourceAccount = await server.loadAccount(walletStore.address);
    const networkPassphrase = walletStore.network === 'testnet'
      ? 'Test SDF Network ; September 2015'
      : 'Public Global Stellar Network ; September 2015';

    const licenseKey = `license:${Date.now()}`;
    const truncatedTitle = (licenseData.title || 'New License').slice(0, 24);
    const licensePayload = `c:${contractId.slice(0, 12)}|t:${truncatedTitle}|a:${licenseFee}`;

    const transaction = new TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase,
    })
      .addOperation(
        Operation.payment({
          destination: recipientAddress,
          asset: Asset.native(),
          amount: licenseFee,
        }),
      )
      .addOperation(
        Operation.manageData({
          name: licenseKey,
          value: licensePayload,
        }),
      )
      .addOperation(
        Operation.manageData({
          name: 'contract_id',
          value: contractId,
        }),
      )
      .setTimeout(30)
      .build();

    const transactionXDR = transaction.toEnvelope().toXDR('base64');
    const signedXDR = await walletStore.signTransaction(transactionXDR);
    const signedTx = TransactionBuilder.fromXDR(signedXDR, networkPassphrase);
    const result = await server.submitTransaction(signedTx);

    const explorerUrl = getExplorerUrl(result.hash, walletStore.network);
    transactionStore.add({
      id: txId,
      status: 'confirmed',
      description: `License purchase on Contract [${contractId.slice(0, 8)}...]: ${licenseData.title || 'New License'}`,
      hash: result.hash,
      explorerUrl,
      contractId,
    });

    return result;
  } catch (error) {
    console.error('License submission failed:', error);
    throw error;
  }
}
