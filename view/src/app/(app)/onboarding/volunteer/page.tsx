'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth/use-auth';
import { useCauses, useVolunteerSteps } from '@/hooks';
import { FormPageSkeleton } from '@/components/skeletons';
import { StepperWizard } from '@/components/ui/form';
import { useVolunteerOnboarding } from '@/hooks';
import { Button } from '@/lib/common';
import Link from 'next/link';
import { CardBackground } from '@/components/volunteers/onboarding/CardBackground';

import { SaveIndicator } from '@/components/ui';
import { StaggerItem } from '@/components/common/StaggerItem';

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

export default function VolunteerOnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isReady } = useAuth();
  const { options: causeOptions } = useCauses();
  const { form, saveStatus, updateName, setIsInterest, toggleCause, toggleSkill } =
    useVolunteerOnboarding();
  const [activeStep, setActiveStep] = useState('interest');

  if (!isReady || isLoading || !user) return <FormPageSkeleton />;

  if (!isAuthenticated) {
    router.replace('/login?redirect=/onboarding/volunteer');
    return null;
  }

  const isZoomed = form.name.trim().length > 0;

  const steps = useVolunteerSteps({
    form,
    activeStep,
    setActiveStep,
    updateName,
    setIsInterest,
    toggleCause,
    toggleSkill,
  });

  return (
    <div className="flex w-full h-full fixed top-0 z-[10000]">
      <div className="w-full md:w-1/2 h-full bg-white flex flex-col overflow-y-auto">
        <div className="w-full top-0 sticky pt-10 md:px-[4.5rem] md:py-10">
          <Link href="/dashboard">
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>
          </Link>
        </div>
        <motion.div
          className="flex flex-col gap-4 md:gap-5 w-full max-w-sm md:max-w-none mx-auto md:mx-0 pt-10 md:px-[4.5rem] md:py-14"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <StaggerItem className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-jad-mint text-jad-primary shadow-sm">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-jad-foreground">
                Volunteer profile
              </h1>
              <p className="text-xs text-foreground/60">Tell us about yourself</p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <StepperWizard
              steps={steps}
              activeStep={activeStep}
              onStepChange={(id) => setActiveStep(id)}
              headerExtra={<SaveIndicator status={saveStatus} />}
            />
          </StaggerItem>
        </motion.div>
      </div>
      <CardBackground
        isZoomed={isZoomed}
        isOnCausesOrSkills={activeStep == 'causes' || activeStep == 'skills'}
        name={form.name}
        causes={form.causes}
        skills={form.skills}
        userId={user.id}
        userEmail={user.email ?? ''}
      />
    </div>
  );
}
