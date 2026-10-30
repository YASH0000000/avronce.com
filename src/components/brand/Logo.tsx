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
  const strokeColor = inverted ? '#ffffff' : 'currentColor';

  const sizeClasses = {
    sm: {
      monogram: 'w-5 h-5',
      wordmark: 'text-base tracking-[0.3em]',
      gap: 'gap-2',
    },
    md: {
      monogram: 'w-7 h-7',
      wordmark: 'text-xl tracking-[0.35em]',
      gap: 'gap-2.5',
    },
    lg: {
      monogram: 'w-10 h-10',
      wordmark: 'text-2xl tracking-[0.4em]',
      gap: 'gap-3.5',
    },
    xl: {
      monogram: 'w-14 h-14',
      wordmark: 'text-4xl tracking-[0.45em]',
      gap: 'gap-4',
    },
  }[size];

  // The bespoke AVRONCE architectural Monogram (Interlocking A + V)
  const MonogramSvg = (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses.monogram} shrink-0 transition-transform duration-300 group-hover:scale-105`}
      aria-label="AVRONCE Monogram"
    >
      {/* Outer subtle geometric diamond frame */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeOpacity="0.4"
        transform="rotate(45 50 50)"
      />
      {/* Dynamic Upper Apex 'A' */}
      <path
        d="M 50 18 L 74 74 H 61 L 50 48 L 39 74 H 26 Z"
        fill={strokeColor}
      />
      {/* Modern Inverted Floating Chevron 'V' forming the inner cross-nexus */}
      <path
        d="M 50 82 L 35 48 H 44 L 50 63 L 56 48 H 65 Z"
        fill={strokeColor}
      />
    </svg>
  );

  return (
    <Link
      href="/"
      className={`group inline-flex items-center ${sizeClasses.gap} select-none transition-opacity hover:opacity-90 ${className}`}
      aria-label="AVRONCE Homepage"
    >
      {(variant === 'monogram' || variant === 'combined') && MonogramSvg}
      {(variant === 'wordmark' || variant === 'combined') && (
        <span
          className={`font-serif font-light uppercase ${sizeClasses.wordmark} ${textColor} transition-colors`}
          style={{ fontFamily: 'var(--font-serif, "Cinzel", "Playfair Display", "Times New Roman", serif)' }}
        >
          A V R O N C E
        </span>
      )}
    </Link>
  );
}
