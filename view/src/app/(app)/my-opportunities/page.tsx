'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Calendar, MapPin, Heart, Edit, Users, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth/use-auth';
import { useNgo } from '@/contexts/NgoContext';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/common';

interface Opportunity {
  id: string;
  title: string;
  ngoId: string;
  orgName?: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  city: string | null;
  state: string | null;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  opportunityMode: 'onsite' | 'remote' | 'hybrid' | null;
}

export default function MyOpportunitiesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { organizations, isLoading: orgsLoading } = useNgo();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.replace('/login?redirect=/my-opportunities');
      return;
    }

    if (authLoading || orgsLoading || !organizations.length) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        // Fetch opportunities for all user's organizations
        const orgIds = organizations.map((org) => org.id);
        const allOpps: Opportunity[] = [];

        for (const orgId of orgIds) {
          const oppsRes = await fetch(
            `/api/opportunities?ngoId=${encodeURIComponent(orgId)}&includePast=true&limit=100`,
            { credentials: 'include' }
          );
          if (cancelled) return;
          const oppsData = await oppsRes.json();
          const oppsPayload = oppsData?.opportunities ?? oppsData?.data?.opportunities ?? [];
          const orgOpps = Array.isArray(oppsPayload)
            ? oppsPayload.map((opp: any) => ({
                ...opp,
                orgName: organizations.find((o) => o.id === orgId)?.orgName,
              }))
            : [];
          allOpps.push(...orgOpps);
        }

        // Sort by created date (newest first)
        allOpps.sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
          const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
          return dateB - dateA;
        });

        if (!cancelled) setOpportunities(allOpps);
      } catch {
        if (!cancelled) setOpportunities([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [organizations, isAuthenticated, authLoading, orgsLoading, router]);

  if (authLoading || orgsLoading || loading || !user) {
    return (
      <div className="container">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const formatDate = (d: string | null) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'draft':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="container">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-jad-foreground sm:text-3xl">
            My Opportunities
          </h1>
          <p className="mt-1 text-foreground/70">
            Manage opportunities you&apos;ve created across all your organizations
          </p>
        </div>
      </div>

      {organizations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-jad-primary/20 bg-jad-mint/20 py-16 text-center">
          <Building2 className="h-12 w-12 text-jad-primary/40" />
          <p className="mt-4 font-medium text-jad-foreground">No organizations yet</p>
          <p className="mt-1 text-sm text-foreground/60">
            Create an organization to start posting opportunities
          </p>
          <Link
            href="/organisations/create"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-jad-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-jad-dark"
          >
            <Plus className="h-4 w-4" />
            Create Organization
          </Link>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-jad-primary/20 bg-jad-mint/20 py-16 text-center">
          <Heart className="h-12 w-12 text-jad-primary/40" />
          <p className="mt-4 font-medium text-jad-foreground">No opportunities yet</p>
          <p className="mt-1 text-sm text-foreground/60">
            Create your first opportunity to start engaging volunteers
          </p>
          {organizations.length > 0 && (
            <Link
              href={`/organisations/${organizations[0].id}/opportunities/create`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-jad-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-jad-dark"
            >
              <Plus className="h-4 w-4" />
              Create Opportunity
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => {
            const org = organizations.find((o) => o.id === opp.ngoId);
            const addressStr = [opp.city, opp.state].filter(Boolean).join(', ');

            return (
              <div
                key={opp.id}
                className="rounded-2xl border border-foreground/10 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-bold text-jad-foreground">{opp.title}</h2>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                          getStatusColor(opp.status)
                        )}
                      >
                        {opp.status}
                      </span>
                    </div>
                    {org && (
                      <p className="text-sm text-foreground/70 mb-3">
                        <Building2 className="inline h-4 w-4 mr-1" />
                        {org.orgName}
                      </p>
                    )}
                    {opp.description && (
                      <p className="text-sm text-foreground/70 line-clamp-2 mb-3">
                        {opp.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
                      {opp.startDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {formatDate(opp.startDate)}
                          {opp.endDate && ` - ${formatDate(opp.endDate)}`}
                        </div>
                      )}
                      {addressStr && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {addressStr}
                        </div>
                      )}
                      {opp.opportunityMode && (
                        <span className="capitalize">{opp.opportunityMode}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/organisations/${opp.ngoId}/opportunities/${opp.id}/applications`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-jad-primary px-3 py-2 text-sm font-medium text-jad-primary hover:bg-jad-mint/30"
                    >
                      <Users className="h-4 w-4" />
                      Applications
                    </Link>
                    <Link
                      href={`/organisations/${opp.ngoId}/opportunities/${opp.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-jad-primary px-3 py-2 text-sm font-medium text-white hover:bg-jad-dark"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
