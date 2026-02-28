'use client';

import { cn } from '@/lib/common';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-foreground/10', className)} aria-hidden />;
}
