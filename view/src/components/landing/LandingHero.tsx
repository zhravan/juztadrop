'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/lib/common';

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-jad-teal">
      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Small Actions Lasting Impacts
            </h1>
            <p className="mt-4 text-lg text-white/95 md:text-xl">
              Connect with local ❤️ NGOs and charities that need your help 👋
            </p>

            <div className="mt-8 w-full max-w-2xl">
              <div className="flex flex-col gap-3 rounded-xl bg-white p-2 shadow-lg sm:flex-row sm:items-center">
                <Input
                  placeholder="Eg. Kolkata"
                  className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
                <div className="h-px bg-border sm:h-6 sm:w-px" />
                <Input
                  placeholder="Eg. Care"
                  className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
                <div className="h-px bg-border sm:h-6 sm:w-px" />
                <Input
                  placeholder="Tomorrow"
                  className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
                <button
                  type="button"
                  aria-label="Search"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-jad-teal text-white transition-colors hover:bg-jad-teal-dark"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-4 text-center text-sm text-white/90 sm:text-left">
                or{' '}
                <Link
                  href="/organisations/create"
                  className="font-medium underline underline-offset-2 hover:text-white"
                >
                  Create an Organisation
                </Link>
              </p>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/hero-volunteers.png"
                alt="Volunteers making a difference in their community"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 0vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
