import Link from 'next/link';
import React from 'react';

const TextLogo = ({ href }: { href?: string }) => {
  return (
    <Link
      href={href || ''}
      className="flex items-center  gap-1 text-lg font-bold tracking-tight sm:text-xl transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
    >
      <span className="text-jad-foreground">juzt</span>
      <span className="text-jad-primary">a</span>
      <span className="text-jad-accent">drop</span>
    </Link>
  );
};

export default TextLogo;
