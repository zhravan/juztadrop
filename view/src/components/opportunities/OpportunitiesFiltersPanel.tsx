'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { LOCATIONS } from '@/lib/constants';
import { cn } from '@/lib/common';
import type { CauseOption } from '@/hooks/useCauses';
import { useClickOutside } from '@/hooks';

const LOCATION_DROPDOWN_MAX_HEIGHT = 280;
const LOCATION_SEARCH_PLACEHOLDER = 'Search city…';

export interface OpportunitiesFiltersPanelProps {
  city: string;
  setCity: (v: string) => void;
  mode: string;
  setMode: (v: string) => void;
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
  causes: string[];
  toggleCause: (value: string) => void;
  causeOptions: CauseOption[];
  activeFilterCount: number;
  clearAllFilters: () => void;
}

export function OpportunitiesFiltersPanel({
  city,
  setCity,
  mode,
  setMode,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  causes,
  toggleCause,
  causeOptions,
  activeFilterCount,
  clearAllFilters,
}: OpportunitiesFiltersPanelProps) {
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const locationRef = useRef<HTMLDivElement>(null);
  const locationSearchRef = useRef<HTMLInputElement>(null);

  const handleLocationClickOutside = useCallback(() => {
    setLocationOpen(false);
    setLocationSearch('');
  }, []);
  useClickOutside(locationRef, locationOpen, handleLocationClickOutside);

  const filteredLocations = useMemo(() => {
    const q = locationSearch.trim().toLowerCase();
    if (!q) return ['', ...LOCATIONS];
    return ['', ...LOCATIONS.filter((loc) => loc.toLowerCase().includes(q))];
  }, [locationSearch]);

  useEffect(() => {
    if (locationOpen) {
      setLocationSearch('');
      setTimeout(() => locationSearchRef.current?.focus(), 0);
    }
  }, [locationOpen]);

  const locationLabel = city || 'All cities';

  return (
    <div className="mb-8 space-y-5 rounded-2xl border border-foreground/10 bg-white/80 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-semibold text-jad-foreground"
          id="opportunities-filters-heading"
        >
          Filter opportunities
        </h3>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-medium text-foreground/50 transition-colors hover:text-jad-primary"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        role="group"
        aria-labelledby="opportunities-filters-heading"
      >
        <div ref={locationRef} className="relative">
          <label
            htmlFor="filter-location"
            className="mb-1.5 block text-xs font-medium text-foreground/60"
          >
            Location
          </label>
          <button
            type="button"
            id="filter-location"
            aria-haspopup="listbox"
            aria-expanded={locationOpen}
            onClick={() => setLocationOpen((o) => !o)}
            className={cn(
              'flex w-full items-center justify-between rounded-xl border border-foreground/15 bg-white px-3.5 py-2.5 text-left text-sm',
              'focus:border-jad-primary/40 focus:outline-none focus:ring-2 focus:ring-jad-primary/20',
              !city && 'text-foreground/60'
            )}
          >
            <span className="truncate">{locationLabel}</span>
            <ChevronDown className={cn('h-4 w-4 shrink-0', locationOpen && 'rotate-180')} />
          </button>
          {locationOpen && (
            <div
              className="absolute left-0 top-full z-20 mt-1 w-full min-w-[12rem] overflow-hidden rounded-xl border border-foreground/15 bg-white shadow-lg"
              style={{ maxHeight: LOCATION_DROPDOWN_MAX_HEIGHT }}
            >
              <div className="sticky top-0 border-b border-foreground/10 bg-white p-2">
                <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 focus-within:border-neutral-300 focus-within:ring-0">
                  <Search className="h-4 w-4 shrink-0 text-foreground/50" />
                  <input
                    ref={locationSearchRef}
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder={LOCATION_SEARCH_PLACEHOLDER}
                    className="min-w-0 flex-1 border-0 bg-transparent text-sm text-jad-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-0"
                    aria-label="Search city"
                  />
                </div>
              </div>
              <div
                className="overflow-y-auto py-1"
                style={{ maxHeight: LOCATION_DROPDOWN_MAX_HEIGHT - 56 }}
                role="listbox"
              >
                {filteredLocations.map((loc) => (
                  <button
                    key={loc || '__all__'}
                    type="button"
                    role="option"
                    aria-selected={city === loc}
                    onClick={() => {
                      setCity(loc);
                      setLocationOpen(false);
                    }}
                    className={cn(
                      'w-full px-3.5 py-2.5 text-left text-sm transition-colors',
                      city === loc
                        ? 'bg-jad-mint/50 font-medium text-jad-foreground'
                        : 'text-foreground hover:bg-foreground/5'
                    )}
                  >
                    {loc || 'All cities'}
                  </button>
                ))}
                {filteredLocations.length === 0 && (
                  <p className="px-3.5 py-3 text-sm text-foreground/50">No city matches</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-medium text-foreground/60">Mode</span>
          <div
            className="flex rounded-xl border border-foreground/15 bg-white p-0.5"
            role="group"
            aria-label="Opportunity mode"
          >
            {['', 'onsite', 'remote', 'hybrid'].map((m) => (
              <button
                key={m || 'all'}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  'flex-1 rounded-lg px-2 py-2 text-xs font-medium capitalize transition-all',
                  mode === m
                    ? 'bg-jad-primary text-white shadow-sm'
                    : 'text-foreground/60 hover:text-foreground/80'
                )}
              >
                {m || 'All'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="filter-date-from"
            className="mb-1.5 block text-xs font-medium text-foreground/60"
          >
            From date
          </label>
          <input
            id="filter-date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full rounded-xl border border-foreground/15 bg-white px-3.5 py-2.5 text-sm focus:border-jad-primary/40 focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="filter-date-to"
            className="mb-1.5 block text-xs font-medium text-foreground/60"
          >
            To date
          </label>
          <input
            id="filter-date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full rounded-xl border border-foreground/15 bg-white px-3.5 py-2.5 text-sm focus:border-jad-primary/40 focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
          />
        </div>
      </div>

      <div>
        <span className="mb-2 block text-xs font-medium text-foreground/60">Causes</span>
        <div className="flex flex-wrap gap-2">
          {causeOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleCause(value)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
                causes.includes(value)
                  ? 'bg-jad-primary text-white shadow-md shadow-jad-primary/20'
                  : 'border border-foreground/15 bg-white text-foreground/70 hover:border-jad-primary/30 hover:bg-jad-mint/30'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
