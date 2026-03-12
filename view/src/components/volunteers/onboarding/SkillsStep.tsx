import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { FormSection, SearchableChipGroup } from '@/components/ui/form';
import { StaggerItem } from '@/components/common/StaggerItem';
import { AnimatedFormSection } from '@/components/common/AnimatedFormSection';
import { NavigationButtons } from '@/components/volunteers/onboarding/NavigationButtons';
import { VOLUNTEER_SKILLS } from '@/lib/constants';

interface SkillsStepProps {
  skills: string[];
  toggleSkill: (skill: string) => void;
  activeStep: string;
  setActiveStep: (id: string) => void;
}

export function SkillsStep({ skills, toggleSkill, activeStep, setActiveStep }: SkillsStepProps) {
  return (
    <AnimatedFormSection stepId="skills">
      <StaggerItem>
        <FormSection
          title="Skills (optional)"
          description="Add skills that could help organisations"
          icon={<Sparkles className="h-5 w-5" />}
        >
          <SearchableChipGroup
            options={VOLUNTEER_SKILLS.map((s) => ({ value: s, label: s }))}
            selected={skills}
            onChange={toggleSkill}
            placeholder="Search skills…"
            variant="mint"
          />
        </FormSection>
      </StaggerItem>
      <NavigationButtons activeStep={activeStep} setActiveStep={setActiveStep} showNext={false} />
    </AnimatedFormSection>
  );
}
