'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, Heart, Sparkles, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/use-auth';
import {
  VOLUNTEER_CAUSES,
  VOLUNTEER_SKILLS,
  SKILL_EXPERTISE,
  GENDER_OPTIONS,
} from '@/lib/constants';
import { cn } from '@/lib/common';
import { FormPageSkeleton } from '@/components/skeletons';
import {
  FormField,
  FormInput,
  FormSection,
  ChipGroup,
  StepperWizard,
  SearchableChipGroup,
} from '@/components/ui/form';
import type { WizardStep } from '@/components/ui/form';
import { useProfileForm } from '@/hooks';

function SaveIndicator({ status }: { status: string }) {
  if (status === 'saving') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-foreground/50">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving…
      </span>
    );
  }
  if (status === 'saved') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-jad-primary">
        <Check className="h-3 w-3" />
        Saved
      </span>
    );
  }
  return null;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isReady } = useAuth();
  const { form, saveStatus, updateField, setGender, toggleCause, toggleSkill, setSkillExpertise } =
    useProfileForm();
  const [activeStep, setActiveStep] = useState('account');

  if (!isReady || isLoading || !user) {
    return <FormPageSkeleton />;
  }

  if (!isAuthenticated) {
    router.replace('/login?redirect=/profile');
    return null;
  }

  const steps: WizardStep[] = [
    {
      id: 'account',
      label: 'Account',
      icon: <Mail className="h-5 w-5" />,
      isComplete: true,
      content: (
        <FormSection
          title="Account"
          description="Your sign-in email cannot be changed"
          icon={<Mail className="h-5 w-5" />}
        >
          <FormField label="Email">
            <FormInput
              type="email"
              value={user.email}
              disabled
              className="bg-foreground/5 cursor-not-allowed"
            />
          </FormField>
        </FormSection>
      ),
    },
    {
      id: 'personal',
      label: 'Personal',
      icon: <User className="h-5 w-5" />,
      isComplete: !!form.name,
      content: (
        <FormSection
          title="Personal details"
          description="How we address you and reach you"
          icon={<User className="h-5 w-5" />}
        >
          <FormField label="Full name" htmlFor="name">
            <FormInput
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Your name"
            />
          </FormField>
          <FormField label="Phone" htmlFor="phone" hint="Optional">
            <FormInput
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+91 98765 43210"
              icon={<Phone className="h-5 w-5" />}
            />
          </FormField>
          <FormField label="Gender" hint="Optional">
            <ChipGroup
              options={GENDER_OPTIONS}
              selected={form.gender ? [form.gender] : []}
              onChange={setGender}
            />
          </FormField>
        </FormSection>
      ),
    },
    {
      id: 'causes',
      label: 'Causes',
      icon: <Heart className="h-5 w-5" />,
      isComplete: form.causes.length > 0,
      content: (
        <FormSection
          title="Causes you care about"
          description="Select causes that resonate with you"
          icon={<Heart className="h-5 w-5" />}
        >
          <SearchableChipGroup
            options={VOLUNTEER_CAUSES}
            selected={form.causes}
            onChange={toggleCause}
            placeholder="Search causes…"
          />
        </FormSection>
      ),
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <Sparkles className="h-5 w-5" />,
      isComplete: form.skills.length > 0,
      content: (
        <FormSection
          title="Skills & expertise"
          description="Add skills and set your proficiency level"
          icon={<Sparkles className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <SearchableChipGroup
              options={VOLUNTEER_SKILLS.map((s) => ({ value: s, label: s }))}
              selected={form.skills.map((s) => s.name)}
              onChange={toggleSkill}
              placeholder="Search skills…"
              variant="mint"
            />
            {form.skills.length > 0 && (
              <div className="rounded-xl border border-jad-primary/20 bg-jad-mint/10 p-4 space-y-3">
                <p className="text-xs font-medium text-foreground/70">Expertise level</p>
                <div className="space-y-2.5">
                  {form.skills.map((s) => (
                    <div key={s.name} className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-jad-foreground">{s.name}</span>
                      <div className="flex rounded-lg border border-foreground/10 bg-white p-0.5">
                        {SKILL_EXPERTISE.map((exp) => (
                          <button
                            key={exp}
                            type="button"
                            onClick={() => setSkillExpertise(s.name, exp)}
                            className={cn(
                              'rounded-md px-3 py-1 text-xs font-medium capitalize transition-all duration-150',
                              s.expertise === exp
                                ? 'bg-jad-primary text-white shadow-sm'
                                : 'text-foreground/60 hover:text-foreground/80'
                            )}
                          >
                            {exp}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FormSection>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-jad-mint text-jad-primary shadow-lg shadow-jad-primary/10">
          <User className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-jad-foreground sm:text-3xl">Your profile</h1>
          <p className="mt-1 text-sm text-foreground/70">
            Manage your personal details and volunteering preferences.
          </p>
        </div>
      </div>

      <StepperWizard
        steps={steps}
        activeStep={activeStep}
        onStepChange={setActiveStep}
        headerExtra={<SaveIndicator status={saveStatus} />}
      />
    </div>
  );
}
