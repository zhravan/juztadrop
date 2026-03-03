'use client';

import { Heart, Loader2 } from 'lucide-react';
import { useOpportunitiesList, causeLabel } from '@/hooks/useOpportunitiesList';
import { useCauses } from '@/hooks';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityCardSkeleton } from '@/components/opportunities/OpportunityCardSkeleton';
import { OpportunitiesHero } from '@/components/opportunities/OpportunitiesHero';
import { OpportunitiesFiltersPanel } from '@/components/opportunities/OpportunitiesFiltersPanel';
import { OpportunitiesFiltersToggle } from '@/components/opportunities/OpportunitiesFiltersToggle';
import { FilterBadge } from '@/components/ui';

export default function OpportunitiesPage() {
  const { options: causeOptions } = useCauses();
  const {
    opportunities,
    total,
    isLoading,
    loadingMore,
    filtersOpen,
    setFiltersOpen,
    city,
    setCity,
    causes,
    toggleCause,
    mode,
    setMode,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    activeFilterCount,
    clearAllFilters,
    handleLoadMore,
  } = useOpportunitiesList();

  return (
    <div className="container">
      <OpportunitiesHero isLoading={isLoading} total={total} />

      <div className="mb-6 flex items-center">
        <OpportunitiesFiltersToggle
          filtersOpen={filtersOpen}
          onToggle={() => setFiltersOpen((v) => !v)}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {activeFilterCount > 0 && !filtersOpen && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {city && <FilterBadge label={city} onRemove={() => setCity('')} />}
          {mode && <FilterBadge label={mode} onRemove={() => setMode('')} />}
          {causes.map((c) => (
            <FilterBadge
              key={c}
              label={causeLabel(c, causeOptions)}
              onRemove={() => toggleCause(c)}
            />
          ))}
          {dateFrom && <FilterBadge label={`From ${dateFrom}`} onRemove={() => setDateFrom('')} />}
          {dateTo && <FilterBadge label={`To ${dateTo}`} onRemove={() => setDateTo('')} />}
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-medium text-foreground/50 transition-colors hover:text-jad-primary"
          >
            Clear all
          </button>
        </div>
      )}

      {filtersOpen && (
        <div id="opportunities-filters-panel">
          <OpportunitiesFiltersPanel
            city={city}
            setCity={setCity}
            mode={mode}
            setMode={setMode}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            causes={causes}
            toggleCause={toggleCause}
            causeOptions={causeOptions}
            activeFilterCount={activeFilterCount}
            clearAllFilters={clearAllFilters}
          />
        </div>
      )}

      {isLoading ? (
        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          role="status"
          aria-label="Loading opportunities"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <OpportunityCardSkeleton key={i} />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-jad-primary/20 bg-jad-mint/20 py-16 text-center">
          <Heart className="h-12 w-12 text-jad-primary/40" aria-hidden />
          <p className="mt-4 font-medium text-jad-foreground">
            {activeFilterCount > 0
              ? 'No opportunities match your filters'
              : 'No upcoming opportunities yet'}
          </p>
          <p className="mt-1 text-sm text-foreground/60">
            {activeFilterCount > 0
              ? 'Try adjusting your filters or check back later.'
              : 'Check back soon - new opportunities are added regularly.'}
          </p>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-4 rounded-xl bg-jad-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-jad-primary/25 transition-all hover:bg-jad-dark"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={{
                  id: opp.id,
                  title: opp.title,
                  orgName: opp.orgName ?? '',
                  orgVerificationStatus: opp.orgVerificationStatus,
                  city: opp.city,
                  state: opp.state,
                  startDate: opp.startDate,
                  endDate: opp.endDate,
                  startTime: opp.startTime,
                  endTime: opp.endTime,
                  opportunityMode: opp.opportunityMode,
                  causeCategoryNames: opp.causeCategoryNames ?? [],
                }}
              />
            ))}
          </div>
          {opportunities.length < total && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-jad-primary px-6 py-2.5 text-sm font-semibold text-jad-primary transition-colors hover:bg-jad-mint/30 disabled:opacity-60"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Loading...
                  </>
                ) : (
                  `Load more (${opportunities.length} of ${total})`
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
