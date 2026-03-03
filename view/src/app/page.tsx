import { Suspense } from 'react';
import {
  ViewHeader,
  ViewFooter,
  LandingHero,
  GetInvolvedSection,
  HowItWorksSection,
} from '@/components/landing';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ViewHeader />
      <main className="flex-1">
        <LandingHero />
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <GetInvolvedSection />
        </Suspense>
        <HowItWorksSection />
      </main>
      <ViewFooter />
    </div>
  );
}
