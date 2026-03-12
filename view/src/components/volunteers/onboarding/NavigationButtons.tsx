import { StaggerItem } from '@/components/common/StaggerItem';
import { Button } from '@/lib/common';

export function NavigationButtons({
  activeStep,
  setActiveStep,
  showNext = true,
}: {
  activeStep: string;
  setActiveStep: (id: string) => void;
  showNext?: boolean;
}) {
  const stepOrder = ['interest', 'name', 'causes', 'skills'];

  const goNext = () => {
    const currentIndex = stepOrder.indexOf(activeStep);
    if (currentIndex < stepOrder.length - 1) setActiveStep(stepOrder[currentIndex + 1]);
  };

  const goBack = () => {
    const currentIndex = stepOrder.indexOf(activeStep);
    if (currentIndex > 0) setActiveStep(stepOrder[currentIndex - 1]);
  };

  return (
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
}
