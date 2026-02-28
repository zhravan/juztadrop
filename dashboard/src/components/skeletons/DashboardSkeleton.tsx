'use client';

import { Skeleton } from '../ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="container space-y-10">
      {/* Welcome */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-4">
        <Skeleton className="h-10 w-40 rounded-full" />
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>

      {/* Sections grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-foreground/5 bg-white p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-foreground/10 bg-foreground/5 py-12">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="mt-4 h-5 w-40" />
            <Skeleton className="mt-2 h-4 w-64" />
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-foreground/5 bg-white p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-foreground/10 bg-foreground/5 py-10">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="mt-4 h-4 w-36" />
          </div>
        </div>
      </div>

      {/* Past volunteering */}
      <div className="space-y-4 rounded-2xl border border-foreground/5 bg-white p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="rounded-xl border-2 border-dashed border-foreground/10 bg-foreground/5 py-10">
          <Skeleton className="mx-auto h-4 w-32" />
        </div>
      </div>
    </div>
  );
}
