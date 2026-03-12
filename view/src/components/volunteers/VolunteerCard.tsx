'use client';

import { cn } from '@/lib/common';
import type { CauseOption } from '@/hooks/useCauses';

export interface VolunteerCardData {
  id: string;
  name: string | null;
  email: string;
  causes: string[];
  skills: Array<{ name: string; expertise: string }>;
}

/** Max causes and skills to show on card. Keeps layout consistent. */
const MAX_CAUSES = 2;
const MAX_SKILLS = 2;

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

function getCauseLabel(value: string, causeOptions?: CauseOption[]): string {
  if (causeOptions?.length) {
    const found = causeOptions.find((c) => c.value === value);
    if (found) return found.label;
  }
  return value.replace(/_/g, ' ');
}

export function VolunteerCard({
  volunteer,
  causeOptions,
  className,
}: {
  volunteer: VolunteerCardData;
  causeOptions?: CauseOption[];
  className?: string;
}) {
  const initials = getInitials(volunteer.name, volunteer.email);
  const displayName = volunteer.name || 'Volunteer';
  const colorClass = AVATAR_COLORS[hashCode(volunteer.id) % AVATAR_COLORS.length];
  const causes = (volunteer.causes ?? []).slice(0, MAX_CAUSES);
  const skills = (volunteer.skills ?? []).slice(0, MAX_SKILLS).map((s) => s.name);
  const hasTags = causes.length > 0 || skills.length > 0;

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border border-foreground/10 bg-white p-4 shadow-lg shadow-foreground/5 hover:shadow-xl',
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold',
            colorClass
          )}
        >
          {initials}
        </div>
        <p className="mt-2 truncate w-full font-semibold text-jad-foreground text-sm">
          {displayName}
        </p>
      </div>

      {hasTags && (
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {causes.map((c) => (
            <span
              key={c}
              className="rounded-full bg-jad-mint/50 px-2 py-0.5 text-xs font-medium text-jad-foreground"
            >
              {getCauseLabel(c, causeOptions)}
            </span>
          ))}
          {skills.map((name) => (
            <span
              key={name}
              className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-foreground/80"
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
