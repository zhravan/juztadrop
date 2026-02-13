'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Loader2 } from 'lucide-react';
import { ViewHeader, ViewFooter } from '@/components/landing';
import { useAuth } from '@/lib/auth/use-auth';
import { useQueryClient } from '@tanstack/react-query';
import {
  VOLUNTEER_CAUSES,
  VOLUNTEER_SKILLS,
  SKILL_EXPERTISE,
  GENDER_OPTIONS,
} from '@/lib/constants';
import { cn } from '@/lib/common';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, isReady } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    gender: '' as string,
    causes: [] as string[],
    skills: [] as Array<{ name: string; expertise: string }>,
  });

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name ?? '',
        phone: user.phone ?? '',
        gender: user.gender ?? '',
        causes: user.volunteering?.causes ?? [],
        skills:
          user.volunteering?.skills?.map((s) => ({
            name: s.name,
            expertise: s.expertise || 'intermediate',
          })) ?? [],
      }));
    }
  }, [user]);

  const toggleCause = (value: string) =>
    setForm((f) => ({
      ...f,
      causes: f.causes.includes(value) ? f.causes.filter((x) => x !== value) : [...f.causes, value],
    }));

  const toggleSkill = (skill: string) => {
    setForm((f) => {
      const exists = f.skills.find((s) => s.name === skill);
      if (exists) {
        return { ...f, skills: f.skills.filter((s) => s.name !== skill) };
      }
      return { ...f, skills: [...f.skills, { name: skill, expertise: 'intermediate' }] };
    });
  };

  const setSkillExpertise = (skillName: string, expertise: string) =>
    setForm((f) => ({
      ...f,
      skills: f.skills.map((s) =>
        s.name === skillName ? { ...s, expertise } : s
      ),
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
          name: form.name || undefined,
          phone: form.phone || undefined,
          gender: form.gender || undefined,
          volunteering: {
            isInterest: form.causes.length > 0 || form.skills.length > 0,
            skills: form.skills,
            causes: form.causes,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Failed to update profile');
      toast.success('Profile updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['auth', 'session'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
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
    router.replace('/login?redirect=/profile');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ViewHeader />
      <main className="flex-1 pt-20 pb-16 sm:pt-24">
        <div className="container max-w-2xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-jad-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-jad-mint text-jad-primary">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-jad-foreground">
                Your profile
              </h1>
              <p className="text-sm text-foreground/70">
                Manage your personal details and volunteering preferences.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-jad-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground/70 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-foreground/50">
                Email cannot be changed. It&apos;s used to sign in.
              </p>
            </div>

            {/* Name */}
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
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-jad-foreground mb-1.5">
                Phone (optional)
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-foreground/15 bg-white px-4 py-2.5 text-sm text-jad-foreground placeholder:text-foreground/40 focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-jad-foreground mb-2">
                Gender (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {GENDER_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        gender: f.gender === value ? '' : value,
                      }))
                    }
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-all',
                      form.gender === value
                        ? 'bg-jad-primary text-white'
                        : 'border border-foreground/20 bg-white text-foreground/80 hover:border-jad-primary/40'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Causes */}
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

            {/* Skills with expertise */}
            <div>
              <label className="block text-sm font-medium text-jad-foreground mb-2">
                Skills
              </label>
              <p className="text-xs text-foreground/60 mb-3">
                Click a skill to add it. Use the dropdown to set your expertise level.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {VOLUNTEER_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-all',
                      form.skills.some((s) => s.name === skill)
                        ? 'bg-jad-mint text-jad-foreground'
                        : 'border border-foreground/20 bg-white text-foreground/80 hover:border-jad-primary/40'
                    )}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {form.skills.length > 0 && (
                <div className="space-y-2 rounded-xl border border-jad-primary/20 bg-jad-mint/10 p-4">
                  <span className="text-xs font-medium text-foreground/70">
                    Your expertise level
                  </span>
                  {form.skills.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-sm text-jad-foreground">{s.name}</span>
                      <select
                        value={s.expertise}
                        onChange={(e) =>
                          setSkillExpertise(s.name, e.target.value)
                        }
                        className="rounded-lg border border-foreground/15 bg-white px-3 py-1.5 text-sm text-jad-foreground"
                      >
                        {SKILL_EXPERTISE.map((exp) => (
                          <option key={exp} value={exp}>
                            {exp}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-jad-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-jad-primary/25 transition-all hover:bg-jad-dark disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save changes'
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
