import * as React from 'react';
import { Heart } from 'lucide-react';
import { FormSection, SearchableChipGroup } from '@/components/ui/form';
import { StaggerItem } from '@/components/common/StaggerItem';
import { AnimatedFormSection } from '@/components/common/AnimatedFormSection';
import { NavigationButtons } from '@/components/volunteers/onboarding/NavigationButtons';
import { VOLUNTEER_CAUSES } from '@/lib/constants';

interface CausesStepProps {
  causes: string[];
  toggleCause: (cause: string) => void;
  activeStep: string;
  setActiveStep: (id: string) => void;
}

export function CausesStep({ causes, toggleCause, activeStep, setActiveStep }: CausesStepProps) {
  return (
    <AnimatedFormSection stepId="causes">
      <StaggerItem>
        <FormSection
          title="Causes you care about"
          description="Select all that resonate with you"
          icon={<Heart className="h-5 w-5" />}
        >
          <SearchableChipGroup
            options={VOLUNTEER_CAUSES}
            selected={causes}
            onChange={toggleCause}
            placeholder="Search causes…"
          />
        </FormSection>
      </StaggerItem>
      <NavigationButtons activeStep={activeStep} setActiveStep={setActiveStep} />
    </AnimatedFormSection>
  );
}
