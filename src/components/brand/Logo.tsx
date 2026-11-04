import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  inverted?: boolean;
  href?: string;
  variant?: 'full' | 'icon' | 'wordmark' | string;
}

export function Logo({
  className = '',
  size = 'md',
  inverted = false,
  href = '/',
  variant,
}: LogoProps) {
  const sizeMap = {
    sm: { width: 110, height: 29, classes: 'h-7 w-auto' },
    md: { width: 140, height: 37, classes: 'h-9 w-auto' },
    lg: { width: 175, height: 47, classes: 'h-11 w-auto' },
    xl: { width: 220, height: 59, classes: 'h-14 w-auto' },
  }[size];

  return (
    <Link
      href={href}
      className={`inline-flex items-center select-none transition-opacity hover:opacity-90 ${className}`}
      aria-label="AVRONCE Official Store"
    >
      <div className="relative flex items-center justify-center">
        <Image
          src="/images/avronce-logo.png"
          alt="AVRONCE"
          width={sizeMap.width}
          height={sizeMap.height}
          priority
          className={`${sizeMap.classes} object-contain transition-transform duration-300 hover:scale-102`}
        />
      </div>
    </Link>
  );
}

export default Logo;
