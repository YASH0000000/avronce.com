import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'wordmark' | 'monogram' | 'combined';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  inverted?: boolean;
}

export function Logo({
  variant = 'combined',
  className = '',
  size = 'md',
  inverted = false,
}: LogoProps) {
  const textColor = inverted ? 'text-white' : 'text-zinc-950 dark:text-white';
  const boxBg = inverted ? 'bg-white text-zinc-950' : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950';

  const sizeClasses = {
    sm: {
      box: 'w-6 h-6 text-xs',
      wordmark: 'text-base tracking-[0.2em]',
      gap: 'gap-2',
    },
    md: {
      box: 'w-7 h-7 text-xs font-black',
      wordmark: 'text-xl tracking-[0.25em]',
      gap: 'gap-2.5',
    },
    lg: {
      box: 'w-9 h-9 text-sm font-black',
      wordmark: 'text-2xl tracking-[0.28em]',
      gap: 'gap-3',
    },
    xl: {
      box: 'w-12 h-12 text-lg font-black',
      wordmark: 'text-4xl tracking-[0.3em]',
      gap: 'gap-3.5',
    },
  }[size];

  // Minimalist iconic box emblem
  const BoxIcon = (
    <div
      className={`${sizeClasses.box} ${boxBg} rounded-sm flex items-center justify-center font-bold tracking-tighter shrink-0 transition-transform duration-300 group-hover:rotate-6 shadow-sm`}
    >
      <span>LB</span>
    </div>
  );

  return (
    <Link
      href="/"
      className={`group inline-flex items-center ${sizeClasses.gap} select-none transition-opacity hover:opacity-90 ${className}`}
      aria-label="LITTLEBOX Homepage"
    >
      {(variant === 'monogram' || variant === 'combined') && BoxIcon}
      {(variant === 'wordmark' || variant === 'combined') && (
        <span
          className={`font-sans font-black uppercase ${sizeClasses.wordmark} ${textColor} tracking-[0.22em] transition-colors`}
        >
          LITTLEBOX
        </span>
      )}
    </Link>
  );
}
