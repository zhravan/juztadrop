import * as React from 'react';
import { Heart } from 'lucide-react';
import { FormSection, ChipGroup } from '@/components/ui/form';

const VOLUNTEER_INTEREST_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

interface InterestStepProps {
  isInterest: boolean;
  setIsInterest: (value: boolean) => void;
}

export function InterestStep({ isInterest, setIsInterest }: InterestStepProps) {
  return (
    <FormSection
      title="Are you interested in volunteering?"
      description="Choose Yes to get matched with opportunities and apply. You can change this anytime from your profile."
      icon={<Heart className="h-5 w-5" />}
    >
      <ChipGroup
        options={VOLUNTEER_INTEREST_OPTIONS}
        selected={isInterest ? ['yes'] : ['no']}
        onChange={(value) => setIsInterest(value === 'yes')}
      />
    </FormSection>
  );
}
