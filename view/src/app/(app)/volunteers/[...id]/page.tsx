'use client';

import * as React from 'react';
import { ArrowLeft, MapPin, Mail, ExternalLink, Briefcase, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/lib/common';
import { Skeleton } from '@/components/ui/skeleton';
import { causeLabelForVolunteers } from '@/hooks/useVolunteersList';
import { cn } from '@/lib/common';
import { useVolunteerDetails } from '@/hooks';

const fadeUpSpring = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      type: 'spring',
      stiffness: 280,
      damping: 28,
    },
  }),
};

function CauseBadge({ cause }: { cause: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-jad-primary/20 bg-jad-mint/40 px-3 py-1 text-xs font-medium text-jad-primary">
      <Heart className="h-3 w-3" aria-hidden />
      {causeLabelForVolunteers(cause)}
    </span>
  );
}

function SkillBadge({ skill }: { skill: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-foreground/10 bg-white px-3 py-1 text-xs font-medium text-foreground/70 shadow-sm">
      {skill}
    </span>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-jad-mint/50">
        <Icon className="h-4 w-4 text-jad-primary" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground/50">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-jad-foreground break-words">{value}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div
      className="flex flex-col w-full max-w-[700px] gap-10"
      aria-label="Loading volunteer"
      role="status"
    >
      <div className="flex flex-row items-center gap-8">
        <Skeleton className="w-[90px] h-[90px] rounded-full shrink-0" />
        <div className="flex flex-col gap-3 flex-1">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-xl" />
        </div>
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-24 rounded-full" />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export default function VolunteerDetails() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { volunteer, isLoading, error } = useVolunteerDetails(id ?? '');

  return (
    <div className="flex items-start justify-center w-full min-h-full px-4 py-8">
      <div className="flex flex-col w-full max-w-[700px] gap-10">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUpSpring}>
          <Link href="/volunteers">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 text-gray-500" />
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUpSpring}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-jad-primary/20 bg-jad-mint/20 py-16 text-center"
          >
            <p className="font-medium text-jad-foreground">Volunteer not found</p>
            <p className="mt-1 text-sm text-foreground/60">{error}</p>
            <Link href="/volunteers" className="mt-4">
              <button
                type="button"
                className="rounded-xl bg-jad-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-jad-primary/25 transition-all hover:bg-jad-dark"
              >
                Back to volunteers
              </button>
            </Link>
          </motion.div>
        ) : volunteer ? (
          <>
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUpSpring}
              className="flex flex-row items-center gap-8"
            >
              <div className="relative shrink-0">
                {volunteer.avatarUrl ? (
                  <img
                    src={volunteer.avatarUrl}
                    alt={volunteer.name}
                    className="w-[90px] h-[90px] rounded-full border-4 border-white shadow-md object-cover"
                  />
                ) : (
                  <div className="w-[90px] h-[90px] rounded-full border-4 border-white shadow-md bg-jad-mint flex items-center justify-center">
                    <span className="text-2xl font-bold text-jad-primary">
                      {volunteer.name?.charAt(0) ?? '?'}
                    </span>
                  </div>
                )}
                {volunteer.isAvailable && (
                  <span className="absolute bottom-1 right-1 flex h-3.5 w-3.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 min-w-0">
                <h1 className="text-3xl font-semibold text-jad-foreground leading-tight">
                  {volunteer.name}
                </h1>
                {volunteer.title && (
                  <p className="text-base font-medium text-foreground/50">{volunteer.title}</p>
                )}
                {volunteer.location && (
                  <div className="flex items-center gap-1.5 text-sm text-foreground/50">
                    <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>{volunteer.location}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {volunteer.bio && (
              <motion.div
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeUpSpring}
                className="rounded-2xl border border-foreground/8 bg-white/80 p-5 backdrop-blur-sm"
              >
                <p className="text-sm leading-relaxed text-foreground/70">{volunteer.bio}</p>
              </motion.div>
            )}

            {volunteer.causes?.length > 0 && (
              <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUpSpring}>
                <div className="mb-3 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-jad-primary" aria-hidden />
                  <h2 className="text-sm font-semibold text-jad-foreground">Causes</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {volunteer.causes.map((cause: string) => (
                    <CauseBadge key={cause} cause={cause} />
                  ))}
                </div>
              </motion.div>
            )}

            {volunteer.skills?.length > 0 && (
              <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUpSpring}>
                <div className="mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-foreground/50" aria-hidden />
                  <h2 className="text-sm font-semibold text-jad-foreground">Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {volunteer.skills.map((skill: string) => (
                    <SkillBadge key={skill} skill={skill} />
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={fadeUpSpring}
              className="flex flex-col gap-4 rounded-2xl border border-foreground/8 bg-white/80 p-5 backdrop-blur-sm"
            >
              <h2 className="text-sm font-semibold text-jad-foreground">Contact</h2>
              <div className="flex flex-col gap-4">
                {volunteer.email && <DetailRow icon={Mail} label="Email" value={volunteer.email} />}
                {volunteer.website && (
                  <DetailRow icon={ExternalLink} label="Website" value={volunteer.website} />
                )}
              </div>
            </motion.div>
          </>
        ) : null}
      </div>
    </div>
  );
}
