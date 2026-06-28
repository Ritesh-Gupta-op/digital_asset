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

export async function sendXLMPayment(
  destination: string,
  amount: string,
  description: string,
) {
  const walletStore = useWalletStore.getState();
  const transactionStore = useTransactionStore.getState();
  
  if (!walletStore.connected || !walletStore.address) {
    throw new Error('Wallet not connected');
  }

  try {
    // Create transaction record
    const txId = `tx-${Date.now()}`;
    transactionStore.add({
      id: txId,
      status: 'pending',
      description,
    });

    // Get source account
    const sourceAccount = await server.loadAccount(walletStore.address);

    const networkPassphrase = walletStore.network === 'testnet' 
      ? 'Test SDF Network ; September 2015' 
      : 'Public Global Stellar Network ; September 2015';

    // Create transaction
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
      .setTimeout(30)
      .build();

    // Sign transaction with wallet
    transactionStore.update(txId, { status: 'processing' });
    const transactionXDR = transaction.toEnvelope().toXDR('base64');
    const signedXDR = await walletStore.signTransaction(transactionXDR);

    // Reconstruct transaction from signed XDR
    const signedTx = TransactionBuilder.fromXDR(signedXDR, networkPassphrase);

    // Submit transaction
    const result = await server.submitTransaction(signedTx);

    const explorerUrl = getExplorerUrl(result.hash, walletStore.network);
    transactionStore.update(txId, {
      status: 'confirmed',
      hash: result.hash,
      explorerUrl,
    });

    return result;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

export async function submitLicenseDraft(
  licenseData: any,
  recipientAddress: string,
  licenseFee: string = '10', // XLM
) {
  try {
    const result = await sendXLMPayment(
      recipientAddress,
      licenseFee,
      `License: ${licenseData.title || 'New License'}`,
    );
    return result;
  } catch (error) {
    console.error('License submission failed:', error);
    throw error;
  }
}
