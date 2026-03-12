import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/common';
import { VolunteerCard } from '@/components/volunteers/VolunteerCard';

function MiniChip({
  label,
  index,
  variant = 'default',
}: {
  label: string;
  index: number;
  variant?: 'default' | 'mint';
}) {
  return (
    <motion.span
      key={label}
      initial={{ opacity: 0, scale: 0.85, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: -4 }}
      transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.3, delay: index * 0.04 }}
      className={cn(
        'inline-flex items-center rounded-full border px-1.5 py-0.5 max-w-[60px] shrink-0',
        variant === 'mint'
          ? 'border-white/40 bg-white/15 text-white'
          : 'border-white/40 bg-white/20 text-white'
      )}
    >
      <span className="text-[8px] font-medium truncate leading-tight">{label}</span>
    </motion.span>
  );
}

function ProfileCard({
  name,
  causes,
  skills,
  userId,
  userEmail,
}: {
  name: string;
  causes: string[];
  skills: string[];
  userId: string;
  userEmail: string;
}) {
  const volunteerData = {
    id: userId,
    name: name || null,
    email: userEmail,
    causes,
    skills: skills.map((s) => ({ name: s, expertise: '' })),
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <VolunteerCard volunteer={volunteerData} className="py-2 px-2" />
    </div>
  );
}

function FlippableMiddleCard({
  isFlipped,
  name,
  causes,
  skills,
  userId,
  userEmail,
}: {
  isFlipped: boolean;
  name: string;
  causes: string[];
  skills: string[];
  userId: string;
  userEmail: string;
}) {
  return (
    <div
      style={{ perspective: '400px', perspectiveOrigin: '50% 50%' }}
      className="h-[200px] w-[150px] shrink-0"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
        style={{
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            inset: 0,
          }}
          className="border-[1px] rounded-xl overflow-hidden bg-white border-border flex flex-col shadow-sm"
        >
          <ProfileCard
            name={name}
            causes={causes}
            skills={skills}
            userId={userId}
            userEmail={userEmail}
          />
        </div>

        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute',
            inset: 0,
          }}
          className="border-[1px] rounded-xl overflow-hidden bg-white border-border flex flex-col shadow-sm items-center justify-center"
        >
          <div className="flex flex-wrap justify-center gap-1.5 p-2">
            {causes.map((c) => (
              <span
                key={c}
                className="rounded-full bg-jad-mint/50 px-2 py-0.5 text-[7px] font-medium text-jad-foreground"
              >
                {c}
              </span>
            ))}
            {skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-foreground/10 px-2 py-0.5 text-[7px] text-foreground/80"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function CardBackground({
  isZoomed,
  isOnCausesOrSkills,
  name,
  causes,
  skills,
  userId,
  userEmail,
}: {
  isZoomed: boolean;
  isOnCausesOrSkills: boolean;
  name: string;
  causes: string[];
  skills: string[];
  userId: string;
  userEmail: string;
}) {
  const desktopRows = [
    Array.from({ length: 7 }, (_, i) => i),
    Array.from({ length: 7 }, (_, i) => i + 7),
    Array.from({ length: 7 }, (_, i) => i + 14),
  ];

  return (
    <div className="hidden md:block w-1/2 h-full bg-secondary overflow-hidden relative shrink-0">
      <motion.div
        className="absolute top-1/2 left-1/2 w-screen h-fit flex flex-col gap-8"
        animate={{ scale: isZoomed ? 1.6 : 1, x: '-50%', y: '-50%' }}
        transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.7 }}
      >
        {desktopRows.map((row, rowIndex) => (
          <motion.div
            key={rowIndex}
            className="flex flex-row gap-8 justify-center"
            initial={{ x: rowIndex % 2 === 0 ? -800 : 800, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: 'tween',
              ease: [0.16, 1, 0.3, 1],
              duration: 1.1,
              delay: 0.3 + rowIndex * 0.18,
            }}
          >
            {row.map((cardIndex) =>
              cardIndex === 10 ? (
                <FlippableMiddleCard
                  key={cardIndex}
                  isFlipped={isOnCausesOrSkills}
                  name={name}
                  causes={causes}
                  skills={skills}
                  userId={userId}
                  userEmail={userEmail}
                />
              ) : (
                <div
                  key={cardIndex}
                  className="border-[1px] h-[200px] w-[150px] shrink-0 rounded-xl overflow-hidden bg-input border-border/50"
                >
                  <ProfileCard name="" causes={[]} skills={[]} userId="" userEmail="" />
                </div>
              )
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
