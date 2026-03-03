'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Mail,
  User,
  Globe,
  FileText,
  ChevronDown,
  Search,
  ChevronLeft,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { LOCATIONS } from '@/lib/constants';
import { cn } from '@/lib/common';
import {
  FormField,
  FormInput,
  FormTextarea,
  FormSection,
  ChipGroup,
  FormActions,
  StepperWizard,
} from '@/components/ui/form';
import type { WizardStep } from '@/components/ui/form';
import { useEditOrganization, useOrganizationTypes, useCauses, useClickOutside } from '@/hooks';
import { Skeleton } from '@/components/ui/skeleton';

const STEP_IDS = ['basic', 'causes', 'address', 'contact', 'about'] as const;
const CITY_DROPDOWN_MAX_HEIGHT = 280;
const CITY_SEARCH_PLACEHOLDER = 'Search city…';

export default function EditOrganisationPage() {
  const params = useParams<{ id: string }>();
  const orgId = params.id;
  const { options: orgTypeOptions, isLoading: orgTypesLoading } = useOrganizationTypes();
  const { options: causeOptions } = useCauses();
  const { form, setForm, loading, submitting, toggleCause, handleSubmit } =
    useEditOrganization(orgId);

  const [activeStep, setActiveStep] = useState<(typeof STEP_IDS)[number]>('basic');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const citySearchInputRef = useRef<HTMLInputElement>(null);

  const handleCityClickOutside = useCallback(() => {
    setCityDropdownOpen(false);
    setCitySearch('');
  }, []);
  useClickOutside(cityDropdownRef, cityDropdownOpen, handleCityClickOutside);

  const filteredCities = useMemo(() => {
    const q = citySearch.trim().toLowerCase();
    if (!q) return ['', ...LOCATIONS];
    return ['', ...LOCATIONS.filter((loc) => loc.toLowerCase().includes(q))];
  }, [citySearch]);

  useEffect(() => {
    if (cityDropdownOpen) {
      setCitySearch('');
      setTimeout(() => citySearchInputRef.current?.focus(), 0);
    }
  }, [cityDropdownOpen]);

  const cityLabel = form.city || 'Select city';

  if (loading) {
    return (
      <div className="container">
        <Skeleton className="mb-6 h-6 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const steps: WizardStep[] = [
    {
      id: 'basic',
      label: 'Basic',
      icon: <Building2 className="h-5 w-5" />,
      isComplete: !!(form.orgName.trim() && form.type?.trim() && form.registrationNumber?.trim()),
      content: (
        <FormSection
          title="Basic information"
          description="Your organisation's legal and identity details"
          icon={<Building2 className="h-5 w-5" />}
        >
          <FormField label="Organisation name" htmlFor="orgName" required>
            <FormInput
              id="orgName"
              type="text"
              value={form.orgName}
              onChange={(e) => setForm({ ...form, orgName: e.target.value })}
              placeholder="e.g. Ocean Guardians"
              required
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Organisation type" htmlFor="type" required>
              <select
                id="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-xl border border-foreground/15 bg-white px-4 py-2.5 text-sm focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
                disabled={orgTypesLoading}
                required
              >
                <option value="">{orgTypesLoading ? 'Loading...' : 'Select type'}</option>
                {orgTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Registration number" htmlFor="registrationNumber" required>
              <FormInput
                id="registrationNumber"
                type="text"
                value={form.registrationNumber}
                onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                placeholder="e.g. 80G/12345"
                required
              />
            </FormField>
          </div>
        </FormSection>
      ),
    },
    {
      id: 'causes',
      label: 'Causes',
      icon: <Globe className="h-5 w-5" />,
      isComplete: form.causes.length > 0,
      content: (
        <FormSection
          title="Focus causes"
          description="Which causes does your organisation work towards?"
          icon={<Globe className="h-5 w-5" />}
        >
          <ChipGroup options={causeOptions} selected={form.causes} onChange={toggleCause} />
        </FormSection>
      ),
    },
    {
      id: 'address',
      label: 'Address',
      icon: <MapPin className="h-5 w-5" />,
      isComplete: !!(form.address?.trim() && form.city?.trim() && form.state?.trim()),
      content: (
        <FormSection
          title="Address"
          description="Where is your organisation located?"
          icon={<MapPin className="h-5 w-5" />}
        >
          <FormField label="Street address" htmlFor="address" required>
            <FormTextarea
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Street address"
              rows={3}
              required
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="City" htmlFor="city" required>
              <div ref={cityDropdownRef} className="relative">
                <button
                  type="button"
                  id="city"
                  aria-haspopup="listbox"
                  aria-expanded={cityDropdownOpen}
                  onClick={() => setCityDropdownOpen((o) => !o)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl border border-foreground/15 bg-white px-4 py-2.5 text-left text-sm',
                    'focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20',
                    !form.city && 'text-foreground/50'
                  )}
                >
                  <span className="truncate">{cityLabel}</span>
                  <ChevronDown
                    className={cn('h-5 w-5 shrink-0', cityDropdownOpen && 'rotate-180')}
                  />
                </button>
                {cityDropdownOpen && (
                  <div
                    className="absolute left-0 top-full z-20 mt-1 w-full min-w-[12rem] overflow-hidden rounded-xl border border-foreground/15 bg-white shadow-lg"
                    style={{ maxHeight: CITY_DROPDOWN_MAX_HEIGHT }}
                  >
                    <div className="sticky top-0 border-b border-foreground/10 bg-white p-2">
                      <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 focus-within:border-neutral-300 focus-within:ring-0">
                        <Search className="h-4 w-4 shrink-0 text-foreground/50" />
                        <input
                          ref={citySearchInputRef}
                          type="text"
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          placeholder={CITY_SEARCH_PLACEHOLDER}
                          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-jad-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-0"
                          aria-label="Search city"
                        />
                      </div>
                    </div>
                    <div
                      className="overflow-y-auto py-1"
                      style={{ maxHeight: CITY_DROPDOWN_MAX_HEIGHT - 56 }}
                      role="listbox"
                    >
                      {filteredCities.map((loc) => (
                        <button
                          key={loc || '__empty__'}
                          type="button"
                          role="option"
                          aria-selected={form.city === loc}
                          onClick={() => {
                            setForm({ ...form, city: loc });
                            setCityDropdownOpen(false);
                          }}
                          className={cn(
                            'w-full px-4 py-2.5 text-left text-sm',
                            form.city === loc
                              ? 'bg-jad-mint/50 font-medium text-jad-foreground'
                              : 'text-foreground hover:bg-foreground/5'
                          )}
                        >
                          {loc || 'Select city'}
                        </button>
                      ))}
                      {filteredCities.length === 0 && (
                        <p className="px-4 py-3 text-sm text-foreground/50">No city matches</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </FormField>
            <FormField label="State" htmlFor="state" required>
              <FormInput
                id="state"
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="e.g. West Bengal"
                required
              />
            </FormField>
          </div>
        </FormSection>
      ),
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: <User className="h-5 w-5" />,
      isComplete: !!(form.contactPersonName?.trim() && form.contactPersonEmail?.trim()),
      content: (
        <FormSection
          title="Contact person"
          description="Primary contact for the organisation"
          icon={<User className="h-5 w-5" />}
        >
          <FormField label="Contact person" htmlFor="contactPersonName" required>
            <FormInput
              id="contactPersonName"
              type="text"
              value={form.contactPersonName}
              onChange={(e) => setForm({ ...form, contactPersonName: e.target.value })}
              placeholder="e.g. John Doe"
              required
            />
          </FormField>
          <FormField label="Organisation email" htmlFor="contactPersonEmail" required>
            <FormInput
              id="contactPersonEmail"
              type="email"
              value={form.contactPersonEmail}
              onChange={(e) => setForm({ ...form, contactPersonEmail: e.target.value })}
              placeholder="contact@org.org"
              icon={<Mail className="h-5 w-5" />}
              required
            />
          </FormField>
          <FormField label="Phone" htmlFor="contactPersonNumber">
            <FormInput
              id="contactPersonNumber"
              type="tel"
              value={form.contactPersonNumber}
              onChange={(e) => setForm({ ...form, contactPersonNumber: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </FormField>
        </FormSection>
      ),
    },
    {
      id: 'about',
      label: 'About',
      icon: <FileText className="h-5 w-5" />,
      isComplete: !!(form.description?.trim() && form.website?.trim()),
      content: (
        <FormSection
          title="About your organisation"
          description="Share your mission and impact"
          icon={<FileText className="h-5 w-5" />}
        >
          <FormField label="Website" htmlFor="website" required>
            <FormInput
              id="website"
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://..."
              required
            />
          </FormField>
          <FormField label="About" htmlFor="description" required>
            <FormTextarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Your mission, focus areas, and impact..."
              rows={4}
              maxLength={10000}
              showCount
              required
            />
          </FormField>
        </FormSection>
      ),
    },
  ];

  return (
    <div className="container">
      <Link
        href={orgId ? `/organisations/${orgId}` : '/organisations'}
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-jad-primary"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Back to organisation
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-jad-mint text-jad-primary shadow-lg shadow-jad-primary/10">
          <Building2 className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-jad-foreground sm:text-3xl">Edit organisation</h1>
          <p className="mt-1 text-sm text-foreground/70">Update your organisation details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <StepperWizard
          steps={steps}
          activeStep={activeStep}
          onStepChange={(id) => setActiveStep(id as (typeof STEP_IDS)[number])}
        />

        {activeStep === 'about' && (
          <FormActions
            submitLabel="Save changes"
            secondaryLabel="Cancel"
            secondaryHref={orgId ? `/organisations/${orgId}` : '/organisations'}
            loading={submitting}
            disabled={
              !form.orgName?.trim() ||
              !form.type?.trim() ||
              !form.registrationNumber?.trim() ||
              form.causes.length === 0 ||
              !form.address?.trim() ||
              !form.city?.trim() ||
              !form.state?.trim() ||
              !form.contactPersonName?.trim() ||
              !form.contactPersonEmail?.trim() ||
              !form.website?.trim() ||
              !form.description?.trim()
            }
          />
        )}
      </form>
    </div>
  );
}
