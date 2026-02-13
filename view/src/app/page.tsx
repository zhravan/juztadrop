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
        <GetInvolvedSection />
        <HowItWorksSection />
      </main>
      <ViewFooter />
    </div>
  );
}
