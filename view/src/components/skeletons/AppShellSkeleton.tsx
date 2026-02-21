'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function AppShellSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/5 bg-white/80 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between sm:h-16">
          <Skeleton className="h-6 w-24" />
          <div className="hidden md:flex items-center gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full md:hidden" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-14 sm:pt-16">
        <div className="container space-y-8 pt-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-36 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64 lg:col-span-2 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
