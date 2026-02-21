'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/common';

export interface SearchableChipGroupProps {
  options: readonly { value: string; label: string }[] | { value: string; label: string }[];
  selected: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: 'primary' | 'mint';
  className?: string;
  /** Show search input when option count exceeds this threshold (default: 10) */
  searchThreshold?: number;
}

export function SearchableChipGroup({
  options,
  selected,
  onChange,
  placeholder = 'Search…',
  variant = 'primary',
  className,
  searchThreshold = 10,
}: SearchableChipGroupProps) {
  const [query, setQuery] = useState('');
  const showSearch = options.length > searchThreshold;

  const { selectedItems, unselectedFiltered } = useMemo(() => {
    const selectedSet = new Set(selected);
    const selectedItems = options.filter((o) => selectedSet.has(o.value));
    const unselected = options.filter((o) => !selectedSet.has(o.value));
    const q = query.toLowerCase().trim();
    const unselectedFiltered = q
      ? unselected.filter((o) => o.label.toLowerCase().includes(q))
      : unselected;
    return { selectedItems, unselectedFiltered };
  }, [options, selected, query]);

  const chipClass = (isSelected: boolean) =>
    cn(
      'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
      isSelected
        ? variant === 'primary'
          ? 'bg-jad-primary text-white shadow-md shadow-jad-primary/20'
          : 'bg-jad-mint text-jad-foreground border border-jad-primary/30'
        : 'border border-foreground/20 bg-white text-foreground/80 hover:border-jad-primary/40 hover:bg-jad-mint/30'
    );

  return (
    <div className={cn('space-y-3', className)}>
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-foreground/15 bg-white py-2.5 pl-10 pr-9 text-sm text-jad-foreground placeholder:text-foreground/40 focus:border-jad-primary/40 focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Selected chips — always visible at the top */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              className={chipClass(true)}
            >
              {label}
              <X className="ml-1.5 -mr-1 inline h-3.5 w-3.5 opacity-70" />
            </button>
          ))}
        </div>
      )}

      {/* Divider between selected and unselected */}
      {selectedItems.length > 0 && unselectedFiltered.length > 0 && (
        <div className="border-t border-foreground/5" />
      )}

      {/* Unselected chips */}
      <div className="flex flex-wrap gap-2">
        {unselectedFiltered.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={chipClass(false)}
          >
            {label}
          </button>
        ))}
        {showSearch && query && unselectedFiltered.length === 0 && (
          <p className="text-sm text-foreground/50 py-1">No matches for &ldquo;{query}&rdquo;</p>
        )}
      </div>
    </div>
  );
}
