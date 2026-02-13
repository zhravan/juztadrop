'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InProgressPage } from '@/components/common/InProgressPage';
import { useAuth } from '@/lib/auth/use-auth';

function hasVolunteerProfile(user: { volunteering?: { isInterest?: boolean; causes?: string[] } } | null): boolean {
  if (!user?.volunteering) return false;
  return user.volunteering.isInterest === true;
}

export default function OpportunitiesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    if (isAuthenticated && user && !hasVolunteerProfile(user)) {
      router.replace('/onboarding/volunteer');
    }
  }, [isReady, isAuthenticated, user, router]);

  return (
    <InProgressPage
      title="Opportunities"
      description="Browse and discover volunteering opportunities in your area. We're building this."
    />
  );
}
