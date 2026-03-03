'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { VOLUNTEER_CAUSES } from '@/lib/constants';
import type { CauseOption } from './useCauses';

const PAGE_SIZE = 12;

export function causeLabel(value: string, causeOptions?: CauseOption[]): string {
  const options = causeOptions ?? VOLUNTEER_CAUSES;
  return options.find((c) => c.value === value)?.label ?? value;
}

export interface OpportunityListItem {
  id: string;
  title: string;
  orgName?: string;
  orgVerificationStatus?: string;
  city?: string | null;
  state?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  opportunityMode: string;
  causeCategoryNames?: string[];
}

interface OpportunitiesResponse {
  opportunities?: OpportunityListItem[];
  total?: number;
}

export function useOpportunitiesList() {
  const searchParams = useSearchParams();
  const [opportunities, setOpportunities] = useState<OpportunityListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [city, setCity] = useState(searchParams.get('city') ?? '');
  const [causes, setCauses] = useState<string[]>(() => {
    const c = searchParams.get('causes');
    return c ? c.split(',') : [];
  });
  const [mode, setMode] = useState(searchParams.get('mode') ?? '');
  const [dateFrom, setDateFrom] = useState(searchParams.get('dateFrom') ?? '');
  const [dateTo, setDateTo] = useState(searchParams.get('dateTo') ?? '');

  const activeFilterCount =
    (city ? 1 : 0) + (mode ? 1 : 0) + causes.length + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0);

  const clearAllFilters = useCallback(() => {
    setCity('');
    setCauses([]);
    setMode('');
    setDateFrom('');
    setDateTo('');
  }, []);

  const fetchOpportunities = useCallback(
    async (offset: number): Promise<{ items: OpportunityListItem[]; total: number }> => {
      const params = new URLSearchParams();
      if (city) params.set('city', city);
      if (causes.length) params.set('causes', causes.join(','));
      if (mode) params.set('opportunityMode', mode);
      if (dateFrom) params.set('startDateFrom', dateFrom);
      if (dateTo) params.set('startDateTo', dateTo);
      params.set('limit', String(PAGE_SIZE));
      params.set('offset', String(offset));

      const res = await fetch(`/api/opportunities?${params}`, { credentials: 'include' });
      const data: OpportunitiesResponse = await res.json();
      const items = data?.opportunities ?? [];
      const totalVal = data?.total ?? items.length;
      return { items, total: totalVal };
    },
    [city, causes, mode, dateFrom, dateTo]
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchOpportunities(0)
      .then(({ items, total: t }) => {
        if (cancelled) return;
        setOpportunities(items);
        setTotal(t);
      })
      .catch(() => {
        if (!cancelled) setOpportunities([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchOpportunities]);

  const handleLoadMore = useCallback(() => {
    const newOffset = opportunities.length;
    setLoadingMore(true);
    fetchOpportunities(newOffset)
      .then(({ items, total: t }) => {
        setOpportunities((prev) => [...prev, ...items]);
        setTotal(t);
      })
      .finally(() => setLoadingMore(false));
  }, [opportunities.length, fetchOpportunities]);

  const toggleCause = useCallback((value: string) => {
    setCauses((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }, []);

  return {
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
  };
}
