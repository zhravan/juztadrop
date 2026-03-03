'use client';

import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/common';

export interface OpportunitiesFiltersToggleProps {
  filtersOpen: boolean;
  onToggle: () => void;
  activeFilterCount: number;
}

export function OpportunitiesFiltersToggle({
  filtersOpen,
  onToggle,
  activeFilterCount,
}: OpportunitiesFiltersToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={filtersOpen}
      aria-controls="opportunities-filters-panel"
      className={cn(
        'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium',
        filtersOpen || activeFilterCount > 0
          ? 'border-jad-primary/30 bg-jad-mint/40 text-jad-primary'
          : 'border-foreground/15 bg-white/80 text-foreground/70 hover:border-jad-primary/30 hover:bg-jad-mint/20'
      )}
    >
      <SlidersHorizontal className="h-4 w-4" aria-hidden />
      Filters
      {activeFilterCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-jad-primary px-1.5 text-xs font-bold text-white">
          {activeFilterCount}
        </span>
      )}
      <ChevronDown className={cn('h-3.5 w-3.5', filtersOpen && 'rotate-180')} aria-hidden />
    </button>
  );
}
