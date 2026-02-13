'use client';

import Link from 'next/link';

const navLinks = [
  { href: '/events', label: 'Events' },
  { href: '/volunteers', label: 'Volunteers' },
  { href: '/about', label: 'About' },
  { href: '/team', label: 'Team' },
  { href: '/login', label: 'Login' },
];

export function ViewHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 text-xl font-semibold text-foreground">
          <span className="text-jad-teal">just</span>
          <span>drop</span>
        </Link>

        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
