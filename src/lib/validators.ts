import { z } from 'zod';

export const CreateLicenseSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(120),
  terms: z.string().max(2000).optional(),
  ownerAddress: z.string().min(56).max(56).optional(),
  amount: z.string().optional(),
  txHash: z.string().optional(),
});

export const CreateTransactionSchema = z.object({
  id: z.string(),
  hash: z.string().optional(),
  status: z.enum(['pending', 'processing', 'confirmed', 'failed']),
  description: z.string().min(1).max(500),
  contractId: z.string().optional(),
  explorerUrl: z.string().url().optional(),
  amount: z.string().optional(),
  from: z.string().optional(),
});

export type CreateLicenseInput = z.infer<typeof CreateLicenseSchema>;
export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
