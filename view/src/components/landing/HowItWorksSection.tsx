'use client';

import Link from 'next/link';
import { UserPlus, Compass, Send, ArrowRight } from 'lucide-react';
import { buttonVariants, Card, CardContent, CardHeader } from '@/lib/common';
import { cn } from '@/lib/common';

const STEPS = [
  {
    number: 1,
    title: 'Sign Up',
    description: 'Create an account in seconds.',
    icon: UserPlus,
    action: (
      <Link
        href="/signup"
        className={cn(
          buttonVariants({ variant: 'jad-mint', size: 'lg' }),
          'group mt-auto flex w-full items-center justify-center rounded-full px-6 font-semibold transition-all duration-300 hover:scale-[1.02]'
        )}
      >
        Sign Up
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    ),
    illustration: (
      <div className="flex h-24 w-full items-center justify-center rounded-2xl border-2 border-jad-accent bg-jad-dark">
        <UserPlus className="h-12 w-12 text-jad-mint/80" strokeWidth={1.5} />
      </div>
    ),
  },
  {
    number: 2,
    title: 'Explore',
    description: "Explore all kinds of NGO'S near you, and beyond.",
    icon: Compass,
    action: (
      <div className="mt-auto space-y-3">
        <div className="rounded-xl border-2 border-jad-mint/50 bg-jad-dark px-3 py-2.5">
          <span className="text-sm text-jad-mint/70">Search location, cause...</span>
        </div>
        <div className="rounded-xl border-2 border-jad-mint/50 bg-jad-dark px-3 py-2.5">
          <span className="text-sm text-jad-mint/70">Browse opportunities</span>
        </div>
      </div>
    ),
    illustration: (
      <div className="flex h-24 w-full items-center justify-center rounded-2xl border-2 border-jad-accent bg-jad-dark">
        <Compass className="h-12 w-12 text-jad-mint/80" strokeWidth={1.5} />
      </div>
    ),
  },
  {
    number: 3,
    title: 'Apply',
    description: 'Apply to causes, and make an impact.',
    icon: Send,
    action: (
      <Link
        href="/opportunities"
        className={cn(
          buttonVariants({ variant: 'jad-mint', size: 'lg' }),
          'group mt-auto flex w-full items-center justify-center rounded-full px-6 font-semibold transition-all duration-300 hover:scale-[1.02]'
        )}
      >
        Apply Now
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    ),
    illustration: (
      <div className="flex h-24 w-full items-center justify-center rounded-2xl border-2 border-jad-accent bg-jad-dark">
        <Send className="h-12 w-12 text-jad-mint/80" strokeWidth={1.5} />
      </div>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-jad-primary py-20 md:py-28">
      <div className="container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-jad-mint md:text-4xl lg:text-5xl">
            How it works?
          </h2>
          <p className="mt-3 text-lg font-medium text-jad-mint md:text-xl">
            3-Easy Steps
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <Card
              key={step.number}
              className={`
                group relative flex flex-col overflow-hidden rounded-2xl border-2 border-jad-accent/50
                bg-jad-dark p-6 shadow-xl
                transition-all hover:-translate-y-1 hover:border-jad-accent
                hover:shadow-2xl hover:shadow-jad-foreground/10
                md:p-8
                animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both
                ${i === 0 ? 'delay-100' : i === 1 ? 'delay-200' : 'delay-300'}
              `}
            >
              {/* Step number badge */}
              <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-jad-mint/20 text-sm font-bold text-jad-mint">
                {step.number}
              </div>

              <div className="mb-6">{step.illustration}</div>

              <CardHeader className="space-y-2 p-0">
                <h3 className="text-xl font-semibold tracking-tight text-jad-mint md:text-2xl">
                  {step.number}. {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-jad-mint/90 md:text-base">
                  {step.description}
                </p>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col p-0 pt-6">
                {step.action}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
