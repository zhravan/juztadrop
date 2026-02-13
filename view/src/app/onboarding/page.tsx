'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Building2, ArrowRight, LayoutDashboard } from 'lucide-react';
import { ViewHeader, ViewFooter } from '@/components/landing';
import { useAuth } from '@/lib/auth/use-auth';

const ONBOARDING_COMPLETE_KEY = 'juztadrop_onboarding_complete';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace('/login?redirect=/onboarding');
    }
  }, [isReady, isAuthenticated, router]);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      const completed = typeof window !== 'undefined' && sessionStorage.getItem(ONBOARDING_COMPLETE_KEY);
      if (completed) {
        router.replace('/dashboard');
      }
    }
  }, [isReady, isAuthenticated, router]);

  const markCompleteAndGo = (path: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    }
    router.push(path);
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

  return (
    <div className="min-h-screen flex flex-col">
      <ViewHeader />
      <main className="flex-1 pt-20 pb-16 sm:pt-24">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-2xl font-bold tracking-tight text-jad-foreground sm:text-3xl">
              What would you like to do?
            </h1>
            <p className="mt-2 text-foreground/70">
              You can do both — volunteer and run an NGO. Pick where to start.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Volunteer path */}
            <button
              type="button"
              onClick={() => markCompleteAndGo('/onboarding/volunteer')}
              className="group relative overflow-hidden rounded-2xl border-2 border-jad-primary/20 bg-white p-8 text-left shadow-lg shadow-jad-foreground/5 transition-all duration-300 hover:border-jad-primary/40 hover:shadow-xl hover:shadow-jad-primary/15 hover:-translate-y-1"
            >
              <div className="absolute right-4 top-4 rounded-full bg-jad-mint/50 p-2 transition-colors group-hover:bg-jad-mint">
                <ArrowRight className="h-5 w-5 text-jad-primary" strokeWidth={2.5} />
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-jad-mint to-jad-mint/60 text-3xl">
                <Heart className="h-8 w-8 text-jad-primary" strokeWidth={2} />
              </div>
              <h2 className="mt-5 text-xl font-bold text-jad-foreground">
                Start volunteering
              </h2>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                Browse opportunities, apply to causes you care about, and make an impact.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-jad-primary group-hover:underline">
                Set up profile →
              </span>
            </button>

            {/* Create NGO path */}
            <button
              type="button"
              onClick={() => markCompleteAndGo('/organisations/create')}
              className="group relative overflow-hidden rounded-2xl border-2 border-jad-primary/20 bg-white p-8 text-left shadow-lg shadow-jad-foreground/5 transition-all duration-300 hover:border-jad-primary/40 hover:shadow-xl hover:shadow-jad-primary/15 hover:-translate-y-1"
            >
              <div className="absolute right-4 top-4 rounded-full bg-jad-mint/50 p-2 transition-colors group-hover:bg-jad-mint">
                <ArrowRight className="h-5 w-5 text-jad-primary" strokeWidth={2.5} />
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-jad-mint to-jad-mint/60 text-3xl">
                <Building2 className="h-8 w-8 text-jad-primary" strokeWidth={2} />
              </div>
              <h2 className="mt-5 text-xl font-bold text-jad-foreground">
                Create an NGO
              </h2>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                Register your organisation and post opportunities for volunteers.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-jad-primary group-hover:underline">
                Create organisation →
              </span>
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-foreground/60">Or explore your dashboard first</p>
            <button
              type="button"
              onClick={() => markCompleteAndGo('/dashboard')}
              className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-jad-primary/30 bg-white px-5 py-2.5 text-sm font-medium text-jad-foreground transition-all hover:border-jad-primary hover:bg-jad-mint/30"
            >
              <LayoutDashboard className="h-4 w-4" />
              Go to dashboard
            </button>
          </div>
        </div>
      </main>
      <ViewFooter />
    </div>
  );
}
