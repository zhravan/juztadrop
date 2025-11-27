'use client';

import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { OpportunityFilters } from '@justadrop/types';

interface FilterSidebarProps {
  filters: OpportunityFilters;
  onFiltersChange: (filters: OpportunityFilters) => void;
  onReset: () => void;
}

const causeCategories = [
  { value: 'community', label: 'Community Development' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'environment', label: 'Environment' },
  { value: 'animals', label: 'Animal Welfare' },
  { value: 'disaster', label: 'Disaster Relief' },
  { value: 'elderly', label: 'Elderly Care' },
  { value: 'children', label: 'Children & Youth' },
];

const modeOptions = [
  { value: 'onsite', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
];

const statusOptions = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

export default function FilterSidebar({
  filters,
  onFiltersChange,
  onReset,
}: FilterSidebarProps) {
  const updateFilter = (key: keyof OpportunityFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (
    key: 'mode' | 'causeCategory' | 'status' | 'skills',
    value: string
  ) => {
    const current = (filters[key as 'mode' | 'causeCategory' | 'status'] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-drop-800">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      {/* Verified Only */}
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="verified"
            checked={filters.verified || false}
            onCheckedChange={checked => updateFilter('verified', checked)}
          />
          <Label htmlFor="verified" className="text-sm font-medium">
            Verified NGOs Only
          </Label>
        </div>
      </div>

      {/* Mode */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Mode</Label>
        <div className="space-y-2">
          {modeOptions.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`mode-${option.value}`}
                checked={(filters.mode || []).includes(option.value as any)}
                onCheckedChange={() => toggleArrayFilter('mode', option.value)}
              />
              <Label htmlFor={`mode-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Cause Category */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Cause</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {causeCategories.map(category => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={`cause-${category.value}`}
                checked={(filters.causeCategory || []).includes(category.value as any)}
                onCheckedChange={() => toggleArrayFilter('causeCategory', category.value)}
              />
              <Label htmlFor={`cause-${category.value}`} className="text-sm">
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Status</Label>
        <div className="space-y-2">
          {statusOptions.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${option.value}`}
                checked={(filters.status || []).includes(option.value as any)}
                onCheckedChange={() => toggleArrayFilter('status', option.value)}
              />
              <Label htmlFor={`status-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Location</Label>
        <div className="space-y-2">
          <Input
            placeholder="City"
            value={filters.city || ''}
            onChange={e => updateFilter('city', e.target.value)}
          />
          <Input
            placeholder="State"
            value={filters.state || ''}
            onChange={e => updateFilter('state', e.target.value)}
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <Label htmlFor="skills" className="text-sm font-semibold mb-2 block">
          Required Skills
        </Label>
        <Input
          id="skills"
          placeholder="e.g., Communication"
          value={(filters.skills || []).join(', ')}
          onChange={e =>
            updateFilter(
              'skills',
              e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            )
          }
        />
      </div>
    </div>
  );
}
