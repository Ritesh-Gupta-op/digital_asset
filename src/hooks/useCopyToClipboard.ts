import { useState, useCallback } from 'react';

interface UseCopyToClipboardResult {
  /** Copy a string to the clipboard */
  copy: (text: string) => Promise<void>;
  /** True for `feedbackMs` milliseconds after a successful copy */
  copied: boolean;
  /** Non-null if the copy failed */
  error: string | null;
}

/**
 * Copies text to the system clipboard and briefly exposes a `copied` flag so
 * consumers can show a "Copied!" feedback message.
 *
 * @param feedbackMs  How long (ms) to hold `copied = true`. Default: 2000.
 *
 * @example
 * const { copy, copied } = useCopyToClipboard();
 * <button onClick={() => copy(address)}>{copied ? 'Copied!' : 'Copy'}</button>
 */
export function useCopyToClipboard(feedbackMs = 2000): UseCopyToClipboardResult {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers / non-secure contexts
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        setError(null);
        setCopied(true);
        setTimeout(() => setCopied(false), feedbackMs);
      } catch (err) {
        setError((err as Error).message ?? 'Copy failed');
      }
    },
    [feedbackMs],
  );

  return { copy, copied, error };
}
