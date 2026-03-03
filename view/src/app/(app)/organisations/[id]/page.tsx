'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Building2, ChevronLeft, Pencil, Briefcase } from 'lucide-react';
import { useNgo } from '@/contexts/NgoContext';
import { useAuth } from '@/lib/auth/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrgVerificationStatusClass } from '@/lib/status';

export default function OrganisationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { organizations, isLoading: orgsLoading } = useNgo();

  const orgId = params.id;
  const org = organizations.find((o) => o.id === orgId);

  if (authLoading || orgsLoading) {
    return (
      <div className="container">
        <Skeleton className="mb-6 h-6 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.replace('/login?redirect=/organisations');
    return null;
  }

  if (!org) {
    router.replace('/organisations');
    return null;
  }

  return (
    <div className="container">
      <Link
        href="/organisations"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-jad-primary"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Back to My Organizations
      </Link>

      <div className="rounded-2xl border border-foreground/10 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-jad-mint text-jad-primary">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-jad-foreground sm:text-3xl">
                {org.orgName}
              </h1>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${getOrgVerificationStatusClass(org.verificationStatus)}`}
              >
                {org.verificationStatus}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/organisations/${orgId}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-foreground/20 px-4 py-2.5 text-sm font-medium text-foreground/80 hover:border-jad-primary/40 hover:bg-jad-mint/20 hover:text-jad-foreground"
            >
              <Pencil className="h-4 w-4" aria-hidden />
              Edit organisation
            </Link>
            <Link
              href={`/organisations/${orgId}/opportunities`}
              className="inline-flex items-center gap-2 rounded-xl bg-jad-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-jad-primary/25 hover:bg-jad-dark"
            >
              <Briefcase className="h-4 w-4" aria-hidden />
              View opportunities
            </Link>
          </div>
        </div>

        {(org.causes?.length ?? 0) > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-foreground/70">Focus causes</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {(org.causes ?? []).map((c: string) => (
                <span
                  key={c}
                  className="rounded-full bg-jad-mint/50 px-3 py-1 text-sm text-jad-foreground"
                >
                  {c.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {org.description && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-foreground/70">About</h2>
            <p className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap">{org.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
