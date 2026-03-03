'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { DashboardSkeleton } from '@/components/skeletons';
import {
  QuickActions,
  MyApplicationsSection,
  UpcomingSection,
  PastVolunteeringSection,
} from '@/components/dashboard';

export default function DashboardPage() {
  const { user, isLoading, isReady, applications, upcoming, past } = useDashboard();

  if (!isReady || isLoading || !user) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-jad-foreground sm:text-3xl">
          Your dashboard
        </h1>
        <p className="mt-1 text-foreground/70">
          Welcome back, {user.name || user.email} - volunteer, create an NGO, or do both.
        </p>
      </div>

      <QuickActions />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MyApplicationsSection applications={applications} />
        </div>
        <UpcomingSection upcoming={upcoming} />
      </div>

      <section className="mt-8">
        <PastVolunteeringSection past={past} />
      </section>
    </div>
  );
}
