import { useState, useEffect, useCallback } from 'react';
import { getApiErrorMessage } from '@/lib/api-proxy';

export interface CauseOption {
  value: string;
  label: string;
}

export interface Cause {
  id: string;
  value: string;
  label: string;
  sortOrder: number;
}

export function useCauses(): {
  options: CauseOption[];
  causes: Cause[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCauses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/causes', { cache: 'no-store' });
      const data = (await res.json().catch(() => ({}))) as {
        causes?: Cause[];
        error?: string;
      };
      if (!res.ok) {
        setError(getApiErrorMessage(data, 'Failed to load causes'));
        setCauses([]);
        return;
      }
      const list = data.causes ?? [];
      setCauses(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load causes');
      setCauses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCauses();
  }, [fetchCauses]);

  const options: CauseOption[] = causes.map((c) => ({
    value: c.value,
    label: c.label,
  }));

  return { options, causes, isLoading, error, refetch: fetchCauses };
}
