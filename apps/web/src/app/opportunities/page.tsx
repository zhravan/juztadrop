'use client';

import { useState, useEffect } from 'react';
import { opportunitiesApi } from '@/lib/api-client';
import type { OpportunityWithComputed, OpportunityFilters } from '@justadrop/types';
import OpportunityCard from './components/opportunity-card';
import FilterSidebar from './components/filter-sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Plus } from 'lucide-react';

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<OpportunityWithComputed[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<OpportunityFilters>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    loadOpportunities();
  }, [filters]);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const response = await opportunitiesApi.list(filters);
      setOpportunities(response.opportunities);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: OpportunityFilters) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to page 1 when filters change
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const handleLoadMore = () => {
    setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-drop-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-drop-800 mb-2">
              Volunteer Opportunities
            </h1>
            <p className="text-gray-600">
              Discover meaningful ways to make a difference
            </p>
          </div>
          {user && (
            <Link href="/opportunities/create">
              <Button className="bg-drop-600 hover:bg-drop-700 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Opportunity
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:col-span-1">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Opportunities Grid */}
          <div className="lg:col-span-3">
            {loading && opportunities.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-drop-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading opportunities...</p>
              </div>
            ) : opportunities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No opportunities found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {opportunities.length} of {total} opportunities
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {opportunities.map(opportunity => (
                    <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                  ))}
                </div>
                {opportunities.length < total && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loading}
                      variant="outline"
                      className="min-w-[200px]"
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
