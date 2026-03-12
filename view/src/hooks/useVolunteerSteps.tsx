import * as React from 'react';
import { Heart, User, Sparkles } from 'lucide-react';
import type { WizardStep } from '@/components/ui/form';
import { InterestStep } from '@/components/volunteers/onboarding/InterestStep';
import { NameStep } from '@/components/volunteers/onboarding/NameStep';
import { CausesStep } from '@/components/volunteers/onboarding/CausesStep';
import { SkillsStep } from '@/components/volunteers/onboarding/SkillsStep';

export function useVolunteerSteps({
  form,
  activeStep,
  setActiveStep,
  updateName,
  setIsInterest,
  toggleCause,
  toggleSkill,
}: {
  form: any;
  activeStep: string;
  setActiveStep: (id: string) => void;
  updateName: (name: string) => void;
  setIsInterest: (value: boolean) => void;
  toggleCause: (cause: string) => void;
  toggleSkill: (skill: string) => void;
}): WizardStep[] {
  return [
    {
      id: 'interest',
      label: 'Interest',
      icon: <Heart className="h-5 w-5" />,
      isComplete: true,
      content: <InterestStep isInterest={form.isInterest} setIsInterest={setIsInterest} />,
    },
    {
      id: 'name',
      label: 'Basic info',
      icon: <User className="h-5 w-5" />,
      isComplete: !!form.name.trim(),
      content: (
        <NameStep
          name={form.name}
          updateName={updateName}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      ),
    },
    {
      id: 'causes',
      label: 'Causes',
      icon: <Heart className="h-5 w-5" />,
      isComplete: form.causes.length > 0,
      content: (
        <CausesStep
          causes={form.causes}
          toggleCause={toggleCause}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      ),
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <Sparkles className="h-5 w-5" />,
      isComplete: form.skills.length > 0,
      content: (
        <SkillsStep
          skills={form.skills}
          toggleSkill={toggleSkill}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      ),
    },
  ];
}
