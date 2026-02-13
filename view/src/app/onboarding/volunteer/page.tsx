'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Loader2 } from 'lucide-react';
import { ViewHeader, ViewFooter } from '@/components/landing';
import { useAuth } from '@/lib/auth/use-auth';
import { useQueryClient } from '@tanstack/react-query';
import { VOLUNTEER_CAUSES, VOLUNTEER_SKILLS } from '@/lib/constants';
import { cn } from '@/lib/common';
import { toast } from 'sonner';

export default function VolunteerOnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, isReady } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    causes: [] as string[],
    skills: [] as string[],
  });

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name ?? '',
        causes: user.volunteering?.causes ?? [],
        skills: (user.volunteering?.skills ?? []).map((s) => s.name),
      }));
    }
  }, [user]);

  const toggleCause = (value: string) =>
    setForm((f) => ({
      ...f,
      causes: f.causes.includes(value) ? f.causes.filter((x) => x !== value) : [...f.causes, value],
    }));

  const toggleSkill = (skill: string) =>
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter((x) => x !== skill) : [...f.skills, skill],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          name: form.name,
          volunteering: {
            isInterest: true,
            skills: form.skills.map((name) => ({ name, expertise: 'intermediate' })),
            causes: form.causes,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Failed to save');
      toast.success('Volunteer profile saved');
      await queryClient.invalidateQueries({ queryKey: ['auth', 'session'] });
      router.push('/opportunities');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSubmitting(false);
    }
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
    router.replace('/login?redirect=/onboarding/volunteer');
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
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-jad-foreground">
                Volunteer profile
              </h1>
              <p className="text-sm text-foreground/70">
                Tell us about yourself so we can match you with the right opportunities.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-jad-foreground mb-1.5">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full rounded-xl border border-foreground/15 bg-white px-4 py-2.5 text-sm text-jad-foreground placeholder:text-foreground/40 focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-jad-foreground mb-2">
                Causes you care about
              </label>
              <div className="flex flex-wrap gap-2">
                {VOLUNTEER_CAUSES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleCause(value)}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-all',
                      form.causes.includes(value)
                        ? 'bg-jad-primary text-white'
                        : 'border border-foreground/20 bg-white text-foreground/80 hover:border-jad-primary/40'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-jad-foreground mb-2">
                Skills (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {VOLUNTEER_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-all',
                      form.skills.includes(skill)
                        ? 'bg-jad-mint text-jad-foreground'
                        : 'border border-foreground/20 bg-white text-foreground/80 hover:border-jad-primary/40'
                    )}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between pt-4">
              <Link
                href="/dashboard"
                className="text-center text-sm font-medium text-foreground/70 hover:text-jad-primary"
              >
                Skip for now — go to dashboard
              </Link>
              <button
                type="submit"
                disabled={submitting || !form.name}
                className="rounded-xl bg-jad-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-jad-primary/25 transition-all hover:bg-jad-dark disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save & browse opportunities'
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
