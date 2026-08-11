import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-white/5 border-white/10 text-zinc-300',
  success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  danger: 'bg-[#ef233c]/10 border-[#ef233c]/20 text-red-400',
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  muted: 'bg-zinc-900/60 border-white/5 text-zinc-500',
};

/**
 * Returns the appropriate variant for a license status string.
 */
export function licenseStatusVariant(
  status: 'draft' | 'active' | 'revoked',
): BadgeVariant {
  return { draft: 'warning', active: 'success', revoked: 'danger' }[status] as BadgeVariant;
}

/**
 * Returns the appropriate variant for a transaction status string.
 */
export function txStatusVariant(
  status: 'pending' | 'processing' | 'confirmed' | 'failed',
): BadgeVariant {
  return {
    pending: 'warning',
    processing: 'info',
    confirmed: 'success',
    failed: 'danger',
  }[status] as BadgeVariant;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

/**
 * Small pill badge with semantic color variants.
 * Used for license statuses, transaction states, network indicators, etc.
 *
 * @example
 * <Badge variant="success" dot>Active</Badge>
 * <Badge variant={licenseStatusVariant(lic.status)}>{lic.status}</Badge>
 */
export function Badge({ children, variant = 'default', className = '', dot = false }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full border px-2.5 py-0.5
        text-[10px] font-bold uppercase tracking-wider
        ${variantClasses[variant]}
        ${className}
      `.trim()}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
            variant === 'success'
              ? 'bg-emerald-400'
              : variant === 'danger'
              ? 'bg-red-400'
              : variant === 'warning'
              ? 'bg-yellow-400'
              : variant === 'info'
              ? 'bg-blue-400'
              : 'bg-zinc-400'
          }`}
        />
      )}
      {children}
    </span>
  );
}
