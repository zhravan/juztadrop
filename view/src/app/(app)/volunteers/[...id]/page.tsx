'use client';

import * as React from 'react';
import { ArrowLeft, MapPin, Mail, ExternalLink, Briefcase, Heart } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/lib/common';
import { useVolunteerDetails } from '@/hooks';
import { CauseBadge } from '@/components/volunteers/CauseBadge';
import { SkillBadge } from '@/components/volunteers/SkillBadge';
import { DetailRow } from '@/components/volunteers/DetailRow';
import LoadingSkeleton from '@/components/volunteers/LoadingSkeleton';

const fadeUpSpring: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      type: 'spring' as const,
      stiffness: 280,
      damping: 28,
    },
  }),
};

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
