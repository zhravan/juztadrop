'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, User, Sparkles, Loader2, CheckIcon, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth/use-auth';
import { VOLUNTEER_CAUSES, VOLUNTEER_SKILLS } from '@/lib/constants';
import { useCauses } from '@/hooks';
import { FormPageSkeleton } from '@/components/skeletons';
import { ChipGroup, FormField, FormSection, SearchableChipGroup } from '@/components/ui/form';
import { StepperWizard } from '@/components/ui/form';
import type { WizardStep } from '@/components/ui/form';
import { useVolunteerOnboarding } from '@/hooks';
import { Button, cn } from '@/lib/common';
import { VolunteerCard } from '@/components/volunteers/VolunteerCard';
import { Check } from 'lucide-react';
import { TextMorph } from 'torph/react';
import Link from 'next/link';
import Input from '@/components/common/Input';

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const fadeUpSpring = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 420,
      damping: 32,
      mass: 0.8,
    },
  },
};

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUpSpring} className={className}>
      {children}
    </motion.div>
  );
}

function AnimatedFormSection({ stepId, children }: { stepId: string; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepId}
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="flex flex-col gap-4"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

const VOLUNTEER_INTEREST_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

function SaveIndicator({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-foreground/50">
      {status == 'saving' ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <CheckIcon className="h-3 w-3 text-jad-primary" />
      )}
      <TextMorph className={`${status == 'idle' && 'text-jad-primary'}`}>
        {status == 'saving' ? 'Saving…' : 'Saved'}
      </TextMorph>
    </span>
  );

  return null;
}

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
    <div className="flex flex-col w-full h-full overflow-hidden items-center justify-center px-2 py-2 gap-1.5">
      <div className="w-full" style={{ transformOrigin: 'top center' }}>
        <VolunteerCard volunteer={volunteerData} className="py-2 px-2" />
      </div>
    </div>
  );
}

function CardBackground({
  isZoomed,
  name,
  causes,
  skills,
  userId,
  userEmail,
}: {
  isZoomed: boolean;
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
            {row.map((cardIndex) => (
              <div
                key={cardIndex}
                className={`border-[1px] h-[200px] w-[150px] shrink-0 rounded-xl overflow-hidden ${
                  cardIndex === 10 ? 'bg-white border-border' : 'bg-input border-border/50'
                }`}
              >
                {cardIndex === 10 ? (
                  <ProfileCard
                    name={name}
                    causes={causes}
                    skills={skills}
                    userId={userId}
                    userEmail={userEmail}
                  />
                ) : (
                  <ProfileCard name={''} causes={[]} skills={[]} userId={''} userEmail={''} />
                )}
              </div>
            ))}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

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

  const stepOrder = ['name', 'causes', 'skills'];
  const isZoomed = form.name.trim().length > 0;

  const goNext = () => {
    const currentIndex = stepOrder.indexOf(activeStep);
    if (currentIndex < stepOrder.length - 1) setActiveStep(stepOrder[currentIndex + 1]);
  };

  const goBack = () => {
    const currentIndex = stepOrder.indexOf(activeStep);
    if (currentIndex > 0) setActiveStep(stepOrder[currentIndex - 1]);
  };

  const NavigationButtons = ({ showNext = true }: { showNext?: boolean }) => (
    <StaggerItem>
      <div className="flex flex-row gap-2 mt-4">
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={goBack}
          disabled={activeStep === stepOrder[0]}
        >
          Back
        </Button>
        {showNext && (
          <Button variant="default" size="lg" className="w-full" onClick={goNext}>
            {activeStep === stepOrder[stepOrder.length - 1] ? 'Finish' : 'Next'}
          </Button>
        )}
      </div>
    </StaggerItem>
  );

  const steps: WizardStep[] = [
    {
      id: 'interest',
      label: 'Interest',
      icon: <Heart className="h-5 w-5" />,
      isComplete: true,
      content: (
        <FormSection
          title="Are you interested in volunteering?"
          description="Choose Yes to get matched with opportunities and apply. You can change this anytime from your profile."
          icon={<Heart className="h-5 w-5" />}
        >
          <ChipGroup
            options={VOLUNTEER_INTEREST_OPTIONS}
            selected={form.isInterest ? ['yes'] : ['no']}
            onChange={(value) => setIsInterest(value === 'yes')}
          />
        </FormSection>
      ),
    },
    {
      id: 'name',
      label: 'Basic info',
      icon: <User className="h-5 w-5" />,
      isComplete: !!form.name.trim(),
      content: (
        <AnimatedFormSection stepId="name">
          <StaggerItem>
            <FormSection
              title="Basic info"
              description="We'll use this to personalise your experience"
              icon={<User className="h-5 w-5" />}
            >
              <FormField label="Full name" htmlFor="name" required>
                <Input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => updateName(e.target.value)}
                  placeholder="Your name"
                />
              </FormField>
            </FormSection>
          </StaggerItem>
          <NavigationButtons />
        </AnimatedFormSection>
      ),
    },
    {
      id: 'causes',
      label: 'Causes',
      icon: <Heart className="h-5 w-5" />,
      isComplete: form.causes.length > 0,
      content: (
        <AnimatedFormSection stepId="causes">
          <StaggerItem>
            <FormSection
              title="Causes you care about"
              description="Select all that resonate with you"
              icon={<Heart className="h-5 w-5" />}
            >
              <SearchableChipGroup
                options={VOLUNTEER_CAUSES}
                selected={form.causes}
                onChange={toggleCause}
                placeholder="Search causes…"
              />
            </FormSection>
          </StaggerItem>
          <NavigationButtons />
        </AnimatedFormSection>
      ),
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <Sparkles className="h-5 w-5" />,
      isComplete: form.skills.length > 0,
      content: (
        <AnimatedFormSection stepId="skills">
          <StaggerItem>
            <FormSection
              title="Skills (optional)"
              description="Add skills that could help organisations"
              icon={<Sparkles className="h-5 w-5" />}
            >
              <SearchableChipGroup
                options={VOLUNTEER_SKILLS.map((s) => ({ value: s, label: s }))}
                selected={form.skills}
                onChange={toggleSkill}
                placeholder="Search skills…"
                variant="mint"
              />
            </FormSection>
          </StaggerItem>
          <NavigationButtons showNext={false} />
        </AnimatedFormSection>
      ),
    },
  ];

  return (
    <div className="flex w-full h-full fixed top-0 z-[10000]">
      <div className="w-full md:w-1/2 h-full bg-white flex flex-col overflow-y-auto">
        <div className="w-full top-0 sticky pt-10 md:px-[4.5rem] md:py-10">
          <Link href="/dashboard">
            <Button
              variant="secondary"
              size={'sm'}
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
        name={form.name}
        causes={form.causes}
        skills={form.skills}
        userId={user.id}
        userEmail={user.email ?? ''}
      />
    </div>
  );
}
