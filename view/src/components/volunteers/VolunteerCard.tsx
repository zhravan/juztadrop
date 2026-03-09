'use client';

import { cn } from '@/lib/common';

export interface VolunteerCardData {
  id: string;
  name: string | null;
  email: string;
  causes: string[];
  skills: Array<{ name: string; expertise: string }>;
}

const AVATAR_COLORS = [
  'bg-jad-mint text-jad-primary',
  'bg-amber-100 text-amber-700',
  'bg-sky-100 text-sky-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string | null, email: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  return email ? email.slice(0, 2).toUpperCase() : '?';
}

export function VolunteerCard({
  volunteer,
  className,
}: {
  volunteer: VolunteerCardData;
  className?: string;
}) {
  const initials = getInitials(volunteer.name, volunteer.email);
  const displayName = volunteer.name || 'Volunteer';
  const colorClass = AVATAR_COLORS[hashCode(volunteer.id) % AVATAR_COLORS.length];
  const topCause = volunteer.causes?.[0]?.replace(/_/g, ' ') ?? null;

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-2xl p-6 text-center transition-all',
        className
      )}
    >
      <div
        className={cn(
          'flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold shadow-md bg-white border-white border-solid border-8 cursor-pointer',
          colorClass
        )}
      >
        {initials}
      </div>
      <div className="min-w-0 w-full">
        <p className="truncate text-base font-semibold text-jad-foreground">{displayName}</p>
        {topCause && (
          <p className="mt-0.5 truncate text-xs text-foreground/45 capitalize">{topCause}</p>
        )}
      </div>
    </div>
  );
}
