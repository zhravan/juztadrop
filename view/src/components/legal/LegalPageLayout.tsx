import Link from 'next/link';
import { ViewHeader, ViewFooter } from '@/components/landing';
import { ArrowLeft } from 'lucide-react';

interface LegalPageLayoutProps {
  title: string;
  description?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  description,
  lastUpdated = 'February 2025',
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <ViewHeader />
      <main className="flex-1 pt-20 pb-16 sm:pt-24">
        <div className="container max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-jad-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-jad-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-foreground/70">{description}</p>
          )}
          <p className="mt-4 text-sm text-foreground/50">
            Last updated: {lastUpdated}
          </p>
          <div className="mt-10 space-y-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-jad-foreground [&_h2]:mt-10 [&_h2]:first:mt-0 [&_p]:text-foreground/80 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-foreground/80">
            {children}
          </div>
        </div>
      </main>
      <ViewFooter />
    </div>
  );
}
