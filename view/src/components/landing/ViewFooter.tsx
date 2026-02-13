'use client';

import Link from 'next/link';
import {
  Droplets,
  Heart,
  ArrowRight,
  Mail,
  MapPin,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/common';

const productLinks = [
  { href: '/opportunities', label: 'Find opportunities' },
  { href: '/volunteers', label: 'Meet volunteers' },
  { href: '/organisations/create', label: 'Create organisation' },
];

const companyLinks = [
  { href: '/about', label: 'About us' },
  { href: '/team', label: 'The crew' },
  { href: '/login', label: 'Sign in' },
];

const socialLinks = [
  { href: '#', icon: Twitter, label: 'Twitter' },
  { href: '#', icon: Linkedin, label: 'LinkedIn' },
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Github, label: 'GitHub' },
];

export function ViewFooter() {
  return (
    <footer className="relative overflow-hidden bg-jad-foreground">
      {/* Gradient orbs - ambient glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-jad-accent/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-jad-primary/15 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/2 -top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-jad-mint/10 blur-[80px]" />

      {/* Top edge glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-jad-accent/50 to-transparent" />

      <div className="container relative z-10 pt-10 pb-6 sm:pt-12 sm:pb-8">
        {/* Main footer grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {/* Brand + tagline */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xl font-bold tracking-tight transition-transform hover:scale-[1.02] sm:text-2xl"
            >
              <span className="text-jad-mint">juzt</span>
              <span className="text-jad-accent">a</span>
              <span className="text-white">drop</span>
              <Droplets className="h-5 w-5 text-jad-accent/80 sm:h-6 sm:w-6" />
            </Link>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-jad-mint/80 sm:text-sm">
              Small actions. Lasting impacts. We connect volunteers with
              organisations that need help — one drop at a time.
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-jad-mint/20 bg-jad-mint/5 px-3 py-1.5 text-[11px] font-medium text-jad-mint/90">
              <Sparkles className="h-3 w-3" />
              Every drop counts.
            </p>
          </div>

          {/* Product */}
          <div className="sm:col-span-1 lg:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-jad-mint/60">
              Product
            </h3>
            <ul className="mt-3 space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-xs text-jad-mint/80 transition-colors hover:text-jad-mint sm:text-sm"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="sm:col-span-1 lg:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-jad-mint/60">
              Company
            </h3>
            <ul className="mt-3 space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-xs text-jad-mint/80 transition-colors hover:text-jad-mint sm:text-sm"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-jad-mint/60">
              Stay in the loop
            </h3>
            <p className="mt-3 text-xs text-jad-mint/70 sm:text-sm">
              Drops of inspiration. No spam, promise.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-3 flex flex-col gap-2 sm:flex-row"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-jad-mint/40" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-jad-mint/20 bg-jad-mint/5 py-2 pl-9 pr-3 text-xs text-jad-mint placeholder:text-jad-mint/40 focus:border-jad-accent/50 focus:outline-none focus:ring-2 focus:ring-jad-accent/20 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className={cn(
                  'shrink-0 rounded-lg bg-gradient-to-r from-jad-accent to-jad-primary px-4 py-2 text-xs font-semibold text-white sm:text-sm',
                  'shadow-md shadow-jad-accent/20 transition-all hover:shadow-lg hover:shadow-jad-accent/30 hover:scale-[1.02] active:scale-[0.98]'
                )}
              >
                Drop in
              </button>
            </form>
          </div>
        </div>

        {/* Social + divider */}
        <div className="mt-8 flex flex-col gap-4 border-t border-jad-mint/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border border-jad-mint/15 text-jad-mint/70 sm:h-9 sm:w-9',
                  'transition-all hover:border-jad-accent/40 hover:bg-jad-accent/10 hover:text-jad-mint'
                )}
              >
                <link.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
              </a>
            ))}
          </div>
          <p className="flex items-center gap-2 text-xs text-jad-mint/50">
            <MapPin className="h-3.5 w-3.5" />
            Building impact from India
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col gap-3 border-t border-jad-mint/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5 text-[11px] text-jad-mint/40 sm:text-xs">
            <Heart className="h-3 w-3 text-jad-accent/60 sm:h-3.5 sm:w-3.5" fill="currentColor" />
            © {new Date().getFullYear()} juztadrop. Made with intention.
          </p>
          <div className="flex flex-wrap gap-4 text-[11px] sm:gap-5 sm:text-xs">
            <Link
              href="/privacy"
              className="text-jad-mint/50 transition-colors hover:text-jad-mint/80"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-jad-mint/50 transition-colors hover:text-jad-mint/80"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-jad-mint/50 transition-colors hover:text-jad-mint/80"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
