import * as React from 'react';
import { User } from 'lucide-react';
import { FormSection, FormField } from '@/components/ui/form';
import Input from '@/components/common/Input';
import { StaggerItem } from '@/components/common/StaggerItem';
import { AnimatedFormSection } from '@/components/common/AnimatedFormSection';
import { NavigationButtons } from '@/components/volunteers/onboarding/NavigationButtons';

interface NameStepProps {
  name: string;
  updateName: (name: string) => void;
  activeStep: string;
  setActiveStep: (id: string) => void;
}

export function NameStep({ name, updateName, activeStep, setActiveStep }: NameStepProps) {
  return (
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
              value={name}
              onChange={(e) => updateName(e.target.value)}
              placeholder="Your name"
            />
          </FormField>
        </FormSection>
      </StaggerItem>
      <NavigationButtons activeStep={activeStep} setActiveStep={setActiveStep} />
    </AnimatedFormSection>
  );
}
