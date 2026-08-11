import { z } from 'zod';

// ── Stellar address helper ──────────────────────────────────────────────────
// A valid Stellar public key starts with 'G' and is exactly 56 alphanumeric chars.
const stellarAddressSchema = z
  .string()
  .regex(/^G[A-Z0-9]{55}$/, 'Must be a valid Stellar public key (56 chars, starts with G)');

// ── Amount helper ───────────────────────────────────────────────────────────
// XLM amounts are positive numbers with up to 7 decimal places (stroop precision).
const xlmAmountSchema = z
  .string()
  .regex(/^\d+(\.\d{1,7})?$/, 'Amount must be a positive number with up to 7 decimal places')
  .refine((v) => parseFloat(v) > 0, { message: 'Amount must be greater than 0' })
  .refine((v) => parseFloat(v) <= 900_000_000, {
    message: 'Amount exceeds maximum XLM supply limit',
  });

// ── License ─────────────────────────────────────────────────────────────────

export const CreateLicenseSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(120, 'Title must be at most 120 characters')
    .trim(),
  terms: z.string().max(2000, 'Terms must be at most 2 000 characters').optional(),
  ownerAddress: stellarAddressSchema.optional(),
  /** Royalty / license fee in XLM. Must be between 0.0000001 and 900 000 000. */
  amount: xlmAmountSchema.optional(),
  txHash: z
    .string()
    .regex(/^[a-fA-F0-9]{64}$/, 'Transaction hash must be a 64-character hex string')
    .optional(),
});

export const UpdateLicenseSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(120, 'Title must be at most 120 characters')
    .trim()
    .optional(),
  terms: z.string().max(2000).optional(),
  status: z.enum(['draft', 'active', 'revoked']).optional(),
  ownerAddress: stellarAddressSchema.optional(),
  amount: xlmAmountSchema.optional(),
  txHash: z
    .string()
    .regex(/^[a-fA-F0-9]{64}$/, 'Transaction hash must be a 64-character hex string')
    .optional(),
});

// ── Transaction ─────────────────────────────────────────────────────────────

export const CreateTransactionSchema = z.object({
  id: z.string().min(1, 'Transaction ID is required'),
  hash: z
    .string()
    .regex(/^[a-fA-F0-9]{64}$/, 'Transaction hash must be a 64-character hex string')
    .optional(),
  status: z.enum(['pending', 'processing', 'confirmed', 'failed']),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be at most 500 characters'),
  contractId: z.string().optional(),
  explorerUrl: z.string().url('Must be a valid URL').optional(),
  amount: xlmAmountSchema.optional(),
  from: stellarAddressSchema.optional(),
});

// ── Inferred Types ───────────────────────────────────────────────────────────

export type CreateLicenseInput = z.infer<typeof CreateLicenseSchema>;
export type UpdateLicenseInput = z.infer<typeof UpdateLicenseSchema>;
export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
