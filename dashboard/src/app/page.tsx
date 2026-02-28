'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LayoutWithHeader,
  Button,
} from '../lib/common';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

export default function DashboardPage() {
  const { moderator, isAuthenticated, isLoading, isReady, logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace('/login?redirect=/');
    }
  }, [isReady, isAuthenticated, router]);

  if (!isReady || isLoading || !moderator) {
    return <DashboardSkeleton />;
  }
  return (
    <LayoutWithHeader
      headerProps={{
        nav: (
          <>
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              logout
            </Button>
          </>
        ),
      }}
    >
      <div className="container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome {moderator.user.name || moderator.user.email} to your admin dashboard
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Quick stats and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your dashboard content will appear here.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <CardDescription>Recent activity and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Activity feed will be displayed here.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configuration options will be available here.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LayoutWithHeader>
  );
}
