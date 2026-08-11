import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names, resolving conflicts correctly. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Stellar / XLM formatting ─────────────────────────────────────────────────

/**
 * Truncate a Stellar address to "GABCD…WXYZ" form.
 * @param address  Full 56-character Stellar public key
 * @param prefixLen  Characters to show at the start (default: 6)
 * @param suffixLen  Characters to show at the end (default: 4)
 */
export function truncateAddress(
  address: string,
  prefixLen = 6,
  suffixLen = 4,
): string {
  if (!address || address.length <= prefixLen + suffixLen) return address;
  return `${address.slice(0, prefixLen)}…${address.slice(-suffixLen)}`;
}

/**
 * Format an XLM amount with up to 4 significant decimal places, stripping
 * trailing zeros. Falls back to '—' for null/undefined/NaN inputs.
 *
 * @example
 * formatXLM('100.5000000') // '100.5 XLM'
 * formatXLM('0.0001')      // '0.0001 XLM'
 */
export function formatXLM(amount: string | number | null | undefined): string {
  const n = parseFloat(String(amount ?? ''));
  if (isNaN(n)) return '—';
  return `${parseFloat(n.toFixed(4))} XLM`;
}

/**
 * Format an ISO date string into a short locale date ("Aug 11, 2026").
 * Returns '—' for invalid / missing values.
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

/**
 * Format an ISO date string as a relative time label ("2 hours ago", "just now").
 * Falls back to an absolute date if the difference is more than 7 days.
 */
export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(iso);
  } catch {
    return '—';
  }
}

/**
 * Truncate a transaction hash to "abcd1234…efgh5678" form.
 * @param hash  64-character hex hash string
 */
export function truncateHash(hash: string, prefixLen = 8, suffixLen = 8): string {
  if (!hash || hash.length <= prefixLen + suffixLen) return hash;
  return `${hash.slice(0, prefixLen)}…${hash.slice(-suffixLen)}`;
}
