'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-jad-primary pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Depth gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 20% 20%, rgba(31, 168, 137, 0.3), transparent 50%), radial-gradient(ellipse 80% 60% at 80% 80%, rgba(21, 131, 107, 0.2), transparent 50%)',
        }}
      />

      <div className="container relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
              Small Actions
              <br />
              <span className="text-jad-mint">Lasting Impacts</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/90 md:text-xl">
              Connect with local ❤️ NGOs and charities that need your help 👋
            </p>

            {/* Search - floating card feel */}
            <div className="mt-10">
              <div className="flex flex-col gap-3 rounded-2xl bg-white/95 p-3 shadow-2xl shadow-jad-foreground/20 backdrop-blur sm:flex-row sm:items-stretch sm:gap-0 sm:p-2">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-xl bg-jad-mint/30 px-4 py-3 transition-colors focus-within:bg-jad-mint/50 sm:flex-row sm:items-center sm:gap-2 sm:rounded-l-xl sm:rounded-r-none">
                  <label htmlFor="search-where" className="shrink-0 text-xs font-semibold text-jad-foreground/70 sm:w-14">Where</label>
                  <input
                    id="search-where"
                    type="text"
                    placeholder="Eg. Kolkata"
                    className="min-w-0 flex-1 bg-transparent text-sm text-jad-foreground placeholder:text-jad-foreground/50 focus:outline-none"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-xl bg-jad-mint/30 px-4 py-3 transition-colors focus-within:bg-jad-mint/50 sm:flex-row sm:items-center sm:gap-2 sm:rounded-none">
                  <label htmlFor="search-category" className="shrink-0 text-xs font-semibold text-jad-foreground/70 sm:w-16">Category</label>
                  <input
                    id="search-category"
                    type="text"
                    placeholder="Eg. Care"
                    className="min-w-0 flex-1 bg-transparent text-sm text-jad-foreground placeholder:text-jad-foreground/50 focus:outline-none"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-xl bg-jad-mint/30 px-4 py-3 transition-colors focus-within:bg-jad-mint/50 sm:flex-row sm:items-center sm:gap-2 sm:rounded-none">
                  <label htmlFor="search-when" className="shrink-0 text-xs font-semibold text-jad-foreground/70 sm:w-12">When</label>
                  <input
                    id="search-when"
                    type="text"
                    placeholder="Eg. Tomorrow"
                    className="min-w-0 flex-1 bg-transparent text-sm text-jad-foreground placeholder:text-jad-foreground/50 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Search"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-jad-accent text-white shadow-lg shadow-jad-accent/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-jad-accent/40 active:scale-95 sm:rounded-r-xl sm:rounded-l-none"
                >
                  <Search className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm text-white/85">
                <span>or</span>
                <Link
                  href="/organisations/create"
                  className="font-semibold text-jad-mint underline underline-offset-4 decoration-2 transition-all hover:text-white hover:decoration-white"
                >
                  Create an Organisation →
                </Link>
              </p>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-jad-foreground/30 ring-4 ring-white/20">
              <Image
                src="/images/hero-volunteers.png"
                alt="Volunteers making a difference in their community"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority
                sizes="(max-width: 1024px) 0vw, 45vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
