'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Loader2, Upload, FileText } from 'lucide-react';
import { ViewHeader, ViewFooter } from '@/components/landing';
import { useAuth } from '@/lib/auth/use-auth';
import { LOCATIONS } from '@/lib/constants';
import { cn } from '@/lib/common';

const ORG_TYPES = ['NGO', 'NPO', 'Trust', 'Foundation', 'Society'] as const;

export default function CreateOrganisationPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isReady } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: '',
    registrationNumber: '',
    address: '',
    city: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    website: '',
    registrationDoc: null as File | null,
    proofDoc: null as File | null,
  });

  const handleFileChange = (field: 'registrationDoc' | 'proofDoc') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm((f) => ({ ...f, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: API call to create organisation with form data
    setSubmitting(false);
    router.push('/dashboard');
  };

  if (!isReady || isLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <ViewHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-jad-foreground/60">Loading...</div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.replace('/login?redirect=/organisations/create');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ViewHeader />
      <main className="flex-1 pt-20 pb-16 sm:pt-24">
        <div className="container max-w-2xl">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-jad-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-jad-mint text-jad-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-jad-foreground">
                Register your organisation
              </h1>
              <p className="text-sm text-foreground/70">
                Tell us about your NGO. We&apos;ll verify your details before you can post opportunities.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-jad-foreground mb-1.5">
                  Organisation name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ocean Guardians"
                  className="w-full rounded-xl border border-foreground/15 bg-white px-4 py-2.5 text-sm text-jad-foreground placeholder:text-foreground/40 focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
                  required
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-jad-foreground mb-1.5">
                  Organisation type
                </label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-xl border border-foreground/15 bg-white px-4 py-2.5 text-sm text-jad-foreground focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
                  required
                >
                  <option value="">Select type</option>
                  {ORG_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-jad-foreground mb-1.5">
                  Registration number
                </label>
                <input
                  id="registrationNumber"
                  type="text"
                  value={form.registrationNumber}
                  onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                  placeholder="e.g. 80G/12345"
                  className="w-full rounded-xl border border-foreground/15 bg-white px-4 py-2.5 text-sm text-jad-foreground placeholder:text-foreground/40 focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-jad-foreground mb-1.5">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street address"
                className="w-full rounded-xl border border-foreground/15 bg-white px-4 py-2.5 text-sm text-jad-foreground placeholder:text-foreground/40 focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
                required
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-jad-foreground mb-1.5">
                City
              </label>
              <select
                id="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-xl border border-foreground/15 bg-white px-4 py-2.5 text-sm text-jad-foreground focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
                required
              >
                <option value="">Select city</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-jad-foreground mb-1.5">
                  Contact person
                </label>
                <input
                  id="contactPerson"
                  type="text"
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border border-foreground/15 bg-white px-4 py-2.5 text-sm text-jad-foreground placeholder:text-foreground/40 focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-jad-foreground mb-1.5">
                  Phone
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-foreground/15 bg-white px-4 py-2.5 text-sm text-jad-foreground placeholder:text-foreground/40 focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-jad-foreground mb-1.5">
                Organisation email
              </label>
              <input
                id="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                placeholder="contact@org.org"
                className="w-full rounded-xl border border-foreground/15 bg-white px-4 py-2.5 text-sm text-jad-foreground placeholder:text-foreground/40 focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
                required
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-jad-foreground mb-1.5">
                Website (optional)
              </label>
              <input
                id="website"
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-xl border border-foreground/15 bg-white px-4 py-2.5 text-sm text-jad-foreground placeholder:text-foreground/40 focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-jad-foreground mb-1.5">
                About your organisation
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Your mission, focus areas, and impact..."
                rows={4}
                className="w-full rounded-xl border border-foreground/15 bg-white px-4 py-2.5 text-sm text-jad-foreground placeholder:text-foreground/40 focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20 resize-none"
              />
            </div>

            <div className="space-y-4 rounded-xl border-2 border-dashed border-jad-primary/20 bg-jad-mint/20 p-6">
              <h3 className="text-sm font-semibold text-jad-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents required
              </h3>
              <div>
                <label className="block text-sm font-medium text-jad-foreground mb-2">
                  Registration certificate (PDF, max 5MB)
                </label>
                <label className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border border-foreground/15 bg-white px-4 py-3 transition-colors hover:border-jad-primary/40',
                  form.registrationDoc && 'border-jad-primary/40 bg-jad-mint/30'
                )}>
                  <Upload className="h-5 w-5 text-jad-primary" />
                  <span className="text-sm text-foreground/80">
                    {form.registrationDoc?.name ?? 'Choose file'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange('registrationDoc')}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-jad-foreground mb-2">
                  Proof of address (optional)
                </label>
                <label className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border border-foreground/15 bg-white px-4 py-3 transition-colors hover:border-jad-primary/40',
                  form.proofDoc && 'border-jad-primary/40 bg-jad-mint/30'
                )}>
                  <Upload className="h-5 w-5 text-jad-primary" />
                  <span className="text-sm text-foreground/80">
                    {form.proofDoc?.name ?? 'Choose file'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange('proofDoc')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between pt-4">
              <Link
                href="/dashboard"
                className="text-center text-sm font-medium text-foreground/70 hover:text-jad-primary"
              >
                Save draft
              </Link>
              <button
                type="submit"
                disabled={submitting || !form.name || !form.type || !form.registrationNumber || !form.registrationDoc}
                className="rounded-xl bg-jad-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-jad-primary/25 transition-all hover:bg-jad-dark disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit for verification'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <ViewFooter />
    </div>
  );
}
