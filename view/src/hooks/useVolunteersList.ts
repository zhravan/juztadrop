'use client';

import { useState, useEffect, useCallback } from 'react';
import { VOLUNTEER_CAUSES } from '@/lib/constants';
import type { VolunteerCardData } from '@/components/volunteers/VolunteerCard';
import type { CauseOption } from './useCauses';

const PAGE_SIZE = 24;

export function causeLabelForVolunteers(value: string, causeOptions?: CauseOption[]): string {
  const options = causeOptions ?? VOLUNTEER_CAUSES;
  return options.find((c) => c.value === value)?.label ?? value;
}

interface VolunteersResponse {
  volunteers?: VolunteerCardData[];
  total?: number;
}

export function useVolunteersList() {
  const [volunteers, setVolunteers] = useState<VolunteerCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [causes, setCauses] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  const activeFilterCount = causes.length + skills.length;
  const hasMore = volunteers.length < total;

  const clearAllFilters = useCallback(() => {
    setCauses([]);
    setSkills([]);
  }, []);

  const fetchVolunteers = useCallback(
    async (offset: number): Promise<{ items: VolunteerCardData[]; total: number }> => {
      const params = new URLSearchParams();
      if (causes.length) params.set('causes', causes.join(','));
      if (skills.length) params.set('skills', skills.join(','));
      params.set('limit', String(PAGE_SIZE));
      params.set('offset', String(offset));

      const res = await fetch(`/api/volunteers?${params}`, { credentials: 'include' });
      const data: VolunteersResponse = await res.json();
      const items = data?.volunteers ?? [];
      const totalVal = data?.total ?? items.length;
      return { items, total: totalVal };
    },
    [causes, skills]
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchVolunteers(0)
      .then(({ items, total: t }) => {
        if (cancelled) return;
        setVolunteers(items);
        setTotal(t);
      })
      .catch(() => {
        if (!cancelled) setVolunteers([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchVolunteers]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || volunteers.length >= total) return;
    setLoadingMore(true);
    fetchVolunteers(volunteers.length)
      .then(({ items, total: t }) => {
        setVolunteers((prev) => [...prev, ...items]);
        setTotal(t);
      })
      .finally(() => setLoadingMore(false));
  }, [volunteers.length, total, hasMore, loadingMore, fetchVolunteers]);

  const toggleSkill = useCallback((value: string) => {
    setSkills((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  }, []);

  const toggleCause = useCallback((value: string) => {
    setCauses((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }, []);

  return {
    volunteers,
    total,
    isLoading,
    loadingMore,
    hasMore,
    loadMore,
    filtersOpen,
    setFiltersOpen,
    causes,
    skills,
    toggleCause,
    toggleSkill,
    activeFilterCount,
    clearAllFilters,
  };
}
