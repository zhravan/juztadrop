import { Loader2, Check, AlertCircle } from 'lucide-react';

export type SaveIndicatorStatus = 'saving' | 'saved' | 'idle' | 'error';

export interface SaveIndicatorProps {
  status: SaveIndicatorStatus;
}

export function SaveIndicator({ status }: SaveIndicatorProps) {
  if (status === 'saving') {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs text-foreground/50"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
        Saving…
      </span>
    );
  }

  if (status === 'saved') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-jad-primary" role="status">
        <Check className="h-3 w-3" aria-hidden />
        Saved
      </span>
    );
  }

  if (status === 'error') {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs text-destructive"
        role="status"
        aria-live="polite"
      >
        <AlertCircle className="h-3 w-3" aria-hidden />
        Failed to save
      </span>
    );
  }

  return null;
}
