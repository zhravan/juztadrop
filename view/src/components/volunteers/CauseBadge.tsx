import { causeLabelForVolunteers } from '@/hooks';
import { Heart } from 'lucide-react';

export function CauseBadge({ cause }: { cause: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-jad-primary/20 bg-jad-mint/40 px-3 py-1 text-xs font-medium text-jad-primary">
      <Heart className="h-3 w-3" aria-hidden />
      {causeLabelForVolunteers(cause)}
    </span>
  );
}
