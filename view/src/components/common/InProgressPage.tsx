import Link from 'next/link';
import { ViewHeader, ViewFooter } from '@/components/landing';
import { Construction, ArrowLeft } from 'lucide-react';

interface InProgressPageProps {
  title: string;
  description?: string;
}

export function InProgressPage({ title, description }: InProgressPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <ViewHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-jad-mint/50 text-jad-primary">
            <Construction className="h-10 w-10" />
          </div>
          <span className="mt-6 inline-block rounded-full border border-jad-primary/20 bg-jad-mint/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-jad-primary/90">
            In progress
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-jad-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="mt-3 text-foreground/70">
            {description ?? "We're building something great. Check back soon."}
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-jad-primary/30 bg-white px-5 py-2.5 text-sm font-semibold text-jad-foreground transition-all hover:border-jad-primary hover:bg-jad-mint/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </main>
      <ViewFooter />
    </div>
  );
}
