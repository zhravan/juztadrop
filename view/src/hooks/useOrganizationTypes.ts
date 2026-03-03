import { useState, useEffect, useCallback } from 'react';
import { getApiErrorMessage } from '@/lib/api-proxy';

export interface OrganizationTypeOption {
  value: string;
  label: string;
}

export interface OrganizationType {
  id: string;
  name: string;
  label: string;
  sortOrder: number;
}

export function useOrganizationTypes(): {
  options: OrganizationTypeOption[];
  organizationTypes: OrganizationType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [organizationTypes, setOrganizationTypes] = useState<OrganizationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/organization-types', { cache: 'no-store' });
      const data = (await res.json().catch(() => ({}))) as {
        organizationTypes?: OrganizationType[];
        error?: string;
      };
      if (!res.ok) {
        setError(getApiErrorMessage(data, 'Failed to load organization types'));
        setOrganizationTypes([]);
        return;
      }
      const list = data.organizationTypes ?? [];
      setOrganizationTypes(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organization types');
      setOrganizationTypes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const options: OrganizationTypeOption[] = organizationTypes.map((t) => ({
    value: t.name,
    label: t.label,
  }));

  return { options, organizationTypes, isLoading, error, refetch: fetchTypes };
}
